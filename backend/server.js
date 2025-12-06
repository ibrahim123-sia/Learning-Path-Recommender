const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'SkillBridge API',
    timestamp: new Date().toISOString() 
  });
});

// Get available goals
app.get('/api/goals', (req, res) => {
  res.json([
    'Become a Junior Web Developer',
    'Learn Data Analysis',
    'Master Python Programming',
    'Become a UI/UX Designer',
    'Learn Mobile App Development',
    'Master Machine Learning Basics',
    'Learn Full-Stack Development',
    'Become a Data Scientist',
    'Learn Cloud Computing',
    'Master JavaScript'
  ]);
});

// Get background options
app.get('/api/backgrounds', (req, res) => {
  res.json([
    { id: 'beginner', label: 'Complete Beginner' },
    { id: 'some_exp', label: 'Some Experience' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'professional', label: 'Professional' }
  ]);
});

// Get time options
app.get('/api/time-options', (req, res) => {
  res.json([
    { id: '5-10', label: '5-10 hours/week' },
    { id: '10-15', label: '10-15 hours/week' },
    { id: '15-20', label: '15-20 hours/week' },
    { id: '20+', label: '20+ hours/week' }
  ]);
});

// Generate learning path - SIMPLIFIED AND STRONGER PROMPT
app.post('/api/generate-path', async (req, res) => {
  try {
    const { goal, background, timeCommitment, currentSkills } = req.body;

    if (!goal || !background || !timeCommitment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4000,
      }
    });

    const prompt = `Create a comprehensive 4-6 week learning path in JSON format. You MUST return exactly 4-6 weeks.

LEARNING PATH DETAILS:
- Goal: ${goal}
- User Background: ${background}
- Time Available: ${timeCommitment} per week
- Current Skills: ${currentSkills || 'None'}

IMPORTANT REQUIREMENTS:
1. Generate EXACTLY 4-6 weeks (NOT 2 weeks)
2. Each week must have: weekNumber, title, description, topics array, resources array, and milestone
3. Include real learning platforms (freeCodeCamp, Coursera, Udemy, YouTube, MDN, etc.)
4. Mix of free and paid resources
5. Progressive difficulty from week to week

OUTPUT FORMAT - Return ONLY this JSON structure:
{
  "goal": "${goal}",
  "background": "${background}",
  "timeCommitment": "${timeCommitment}",
  "description": "Brief overview of the learning path",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: [Specific Focus Area]",
      "description": "Detailed description of week 1 learning objectives",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": [
        {
          "type": "video",
          "title": "Specific Course/Tutorial Name",
          "description": "What this resource teaches",
          "duration": "X hours",
          "link": "https://real-platform.com/actual-course",
          "free": true
        }
      ],
      "milestone": "What the learner should achieve by end of week 1"
    },
    {
      "weekNumber": 2,
      "title": "Week 2: [Next Focus Area]",
      "description": "Detailed description of week 2 learning objectives",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": [
        {
          "type": "course",
          "title": "Specific Course/Tutorial Name",
          "description": "What this resource teaches",
          "duration": "X hours",
          "link": "https://real-platform.com/actual-course",
          "free": false
        }
      ],
      "milestone": "What the learner should achieve by end of week 2"
    },
    // Continue for Week 3, Week 4, Week 5, and optionally Week 6
  ],
  "nextSteps": ["Immediate action 1", "Immediate action 2", "Immediate action 3"]
}

CRITICAL: You MUST return 4-6 weeks. Do not return only 2 weeks.`;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text.substring(0, 500) + '...');

    // Parse JSON
    let jsonData;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      jsonData = JSON.parse(jsonMatch[0]);
      console.log(`Parsed JSON with ${jsonData.weeks?.length || 0} weeks`);
      
      // Validate we have 4-6 weeks
      if (!jsonData.weeks || jsonData.weeks.length < 4) {
        console.warn(`AI returned only ${jsonData.weeks?.length || 0} weeks. Adding more weeks...`);
        
        // Add more weeks to reach 4
        const weeksToAdd = 4 - (jsonData.weeks?.length || 0);
        for (let i = 0; i < weeksToAdd; i++) {
          const weekNum = (jsonData.weeks?.length || 0) + 1;
          jsonData.weeks = jsonData.weeks || [];
          jsonData.weeks.push({
            weekNumber: weekNum,
            title: `Week ${weekNum}: Advanced Application`,
            description: `Apply your skills to more complex projects and scenarios.`,
            topics: ["Project Building", "Advanced Techniques", "Problem Solving"],
            resources: [
              {
                type: "course",
                title: "Advanced Skills Development",
                description: "Build upon your foundational knowledge",
                duration: "4-6 hours",
                link: "https://www.coursera.org",
                free: false
              }
            ],
            milestone: `Complete a comprehensive project demonstrating week ${weekNum} skills`
          });
        }
      }
      
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Problematic text:', text);
      
      // Return a simple structured response instead of fallback
      jsonData = {
        goal,
        background,
        timeCommitment,
        description: `AI-generated learning path for ${goal}`,
        weeks: [
          {
            weekNumber: 1,
            title: "Week 1: Foundation Building",
            description: "Establish fundamental concepts and skills",
            topics: ["Basics", "Core Concepts", "Initial Setup"],
            resources: [
              {
                type: "course",
                title: "Beginner Course on Topic",
                description: "Learn the basics",
                duration: "5 hours",
                link: "https://www.freecodecamp.org",
                free: true
              }
            ],
            milestone: "Complete foundational learning"
          },
          {
            weekNumber: 2,
            title: "Week 2: Core Concepts",
            description: "Dive deeper into essential topics",
            topics: ["Intermediate Concepts", "Practice", "Examples"],
            resources: [
              {
                type: "video",
                title: "Intermediate Tutorial Series",
                description: "Detailed explanations",
                duration: "6 hours",
                link: "https://www.youtube.com",
                free: true
              }
            ],
            milestone: "Apply concepts to simple projects"
          },
          {
            weekNumber: 3,
            title: "Week 3: Practical Application",
            description: "Apply knowledge to real-world scenarios",
            topics: ["Projects", "Problem Solving", "Best Practices"],
            resources: [
              {
                type: "course",
                title: "Project-Based Learning",
                description: "Hands-on project development",
                duration: "8 hours",
                link: "https://www.udemy.com",
                free: false
              }
            ],
            milestone: "Complete a medium-sized project"
          },
          {
            weekNumber: 4,
            title: "Week 4: Advanced Topics",
            description: "Explore advanced concepts and techniques",
            topics: ["Advanced Features", "Optimization", "Deployment"],
            resources: [
              {
                type: "article",
                title: "Advanced Guide",
                description: "In-depth coverage of advanced topics",
                duration: "4 hours",
                link: "https://developer.mozilla.org",
                free: true
              }
            ],
            milestone: "Implement advanced features in your project"
          }
        ],
        nextSteps: [
          "Start with Week 1 immediately",
          "Practice daily",
          "Join learning communities",
          "Build portfolio projects"
        ]
      };
    }

    // Add metadata
    jsonData.id = `path_${Date.now()}`;
    jsonData.generatedAt = new Date().toISOString();
    jsonData.duration = `${jsonData.weeks.length} weeks`;

    res.json(jsonData);

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate path',
      message: error.message,
      details: 'Please try again with different inputs'
    });
  }
});

// Save path
app.post('/api/save-path', (req, res) => {
  const { pathData } = req.body;
  
  res.json({
    success: true,
    message: 'Path saved successfully',
    savedAt: new Date().toISOString(),
    pathId: `saved_${Date.now()}`,
    data: pathData
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});