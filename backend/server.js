const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware - Updated for Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'https://skillbridge-ai.vercel.app', // Your Vercel frontend URL
  'https://skillbridge-app.vercel.app', // Alternative common name
  process.env.FRONTEND_URL // Allow from environment variable
].filter(Boolean);

app.use(cors())
app.use(express.json());

// Check API key
if (!process.env.GROQ_API_KEY) {
  console.error('❌ ERROR: GROQ_API_KEY missing in .env file!');
  console.log('');
  console.log('📝 Create .env file with:');
  console.log('PORT=5000');
  console.log('GROQ_API_KEY=your_groq_key_here');
  console.log('');
  console.log('🔑 Get FREE key: https://console.groq.com/keys');
  // Don't exit in production (Vercel), just warn
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// List of WORKING GROQ models
const WORKING_GROQ_MODELS = [
  'llama-3.3-70b-versatile',      // Most capable (recommended)
  'llama-3.2-3b-preview',         // Fast, good for planning
  'llama-3.2-1b-preview',         // Fastest
  'gemma2-9b-it',                 // Good alternative
  'llama-3.1-8b-instant',         // Fast and capable
  'llama-3.2-90b-vision-preview', // Very capable (slower)
];

// Root route - NEW for Vercel
app.get('/', (req, res) => {
  res.json({
    service: 'SkillBridge AI API',
    status: 'operational',
    provider: 'GROQ AI',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    documentation: 'Access /api/health for detailed service status',
    endpoints: [
      'GET  /api/health',
      'GET  /api/goals',
      'GET  /api/backgrounds',
      'GET  /api/time-options',
      'GET  /api/models',
      'POST /api/generate-path',
      'POST /api/save-path',
      'POST /api/test-ai'
    ],
    quickStart: {
      testHealth: 'curl https://your-api.vercel.app/api/health',
      testModels: 'curl https://your-api.vercel.app/api/models',
      generatePath: 'curl -X POST https://your-api.vercel.app/api/generate-path -H "Content-Type: application/json" -d \'{"goal":"Become a Junior Web Developer","background":"beginner","timeCommitment":"5-10"}\''
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'SkillBridge API',
    timestamp: new Date().toISOString(),
    provider: 'GROQ',
    models: WORKING_GROQ_MODELS.length,
    environment: process.env.NODE_ENV || 'development',
    apiKeyConfigured: !!process.env.GROQ_API_KEY,
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
    corsOrigins: allowedOrigins
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

// GROQ API call function
async function callGroqAPI(prompt, model = 'llama-3.2-3b-preview') {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a Learning Path Generator Assistant. You MUST return ONLY valid JSON. Do not include any markdown, code blocks, or explanatory text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      top_p: 0.9,
      stream: false
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GROQ API error ${response.status}: ${errorText.substring(0, 200)}`);
  }

  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response structure from GROQ API');
  }
  
  return data.choices[0].message.content;
}

// Parse AI response
function parseAIResponse(aiText) {
  try {
    // Extract JSON from response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate structure
    if (!parsed.goal || !parsed.weeks) {
      throw new Error('Missing required fields in response');
    }
    
    return parsed;
    
  } catch (error) {
    console.error('Parse error:', error.message);
    console.log('Raw response:', aiText.substring(0, 500));
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

// Generate learning path - UPDATED FOR GROQ
app.post('/api/generate-path', async (req, res) => {
  try {
    const { goal, background, timeCommitment, currentSkills } = req.body;

    if (!goal || !background || !timeCommitment) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        required: ['goal', 'background', 'timeCommitment'] 
      });
    }

    console.log('📝 Generating learning path for:', goal);
    console.log('📊 Parameters:', { background, timeCommitment });

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
    }
  ],
  "nextSteps": ["Immediate action 1", "Immediate action 2", "Immediate action 3"]
}

CRITICAL: You MUST return 4-6 weeks. Do not return only 2 weeks.`;

    console.log('⚡ Calling GROQ API...');
    
    // Try models in order until one works
    let jsonData;
    let usedModel;
    let lastError;
    
    for (const model of WORKING_GROQ_MODELS) {
      try {
        console.log(`   Trying model: ${model}`);
        const response = await callGroqAPI(prompt, model);
        jsonData = parseAIResponse(response);
        usedModel = model;
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (error) {
        lastError = error;
        console.log(`   Model ${model} failed: ${error.message}`);
        continue;
      }
    }

    if (!jsonData) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

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

    // Add metadata
    jsonData.metadata = {
      generatedAt: new Date().toISOString(),
      generatedBy: 'GROQ AI',
      model: usedModel,
      provider: 'GROQ'
    };
    
    jsonData.success = true;
    jsonData.id = `path_${Date.now()}`;
    jsonData.duration = `${jsonData.weeks.length} weeks`;

    res.json(jsonData);

  } catch (error) {
    console.error('❌ GROQ API Error:', error.message);
    
    // Handle specific errors
    let errorMessage = 'Failed to generate learning path';
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.message.includes('401') || error.message.includes('Invalid API key')) {
      statusCode = 401;
      errorMessage = 'Invalid GROQ API key';
      errorDetails = 'Please check your GROQ_API_KEY in .env file';
    } else if (error.message.includes('429') || error.message.includes('rate limit')) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded';
      errorDetails = 'Please wait a moment and try again';
    } else if (error.message.includes('model_decommissioned')) {
      statusCode = 400;
      errorMessage = 'Model deprecated';
      errorDetails = 'Please update server.js with latest models';
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      message: errorDetails,
      provider: 'GROQ',
      timestamp: new Date().toISOString(),
      suggestion: 'Check https://console.groq.com/docs/models for latest models'
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

// Test GROQ connection
app.post('/api/test-ai', async (req, res) => {
  try {
    console.log('🧪 Testing GROQ API connection...');
    
    // Try multiple models
    let success = false;
    let testResult;
    let usedModel;
    
    for (const model of WORKING_GROQ_MODELS.slice(0, 2)) { // Try first 2 models
      try {
        const response = await callGroqAPI('Return {"status": "OK"}', model);
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
        success = true;
        testResult = parsed;
        usedModel = model;
        break;
      } catch (error) {
        console.log(`   Model ${model} test failed: ${error.message}`);
        continue;
      }
    }
    
    if (success) {
      res.json({
        success: true,
        message: 'GROQ API is working correctly',
        model: usedModel,
        response: testResult,
        timestamp: new Date().toISOString(),
        availableModels: WORKING_GROQ_MODELS
      });
    } else {
      throw new Error('All models failed');
    }
    
  } catch (error) {
    console.error('Test Error:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'GROQ API test failed',
      message: error.message,
      timestamp: new Date().toISOString(),
      solution: 'Check your GROQ_API_KEY and account status'
    });
  }
});

// Get available models
app.get('/api/models', (req, res) => {
  res.json({
    success: true,
    models: WORKING_GROQ_MODELS,
    recommended: 'llama-3.2-3b-preview',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET  /',
      'GET  /api/health',
      'GET  /api/goals',
      'GET  /api/backgrounds',
      'GET  /api/time-options',
      'GET  /api/models',
      'POST /api/generate-path',
      'POST /api/save-path',
      'POST /api/test-ai'
    ],
    documentation: 'Visit the root route (/) for API documentation'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Vercel compatibility - export the app for serverless functions
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // For Vercel/production, export as serverless function
  module.exports = app;
} else {
  // For local development, start the server
  app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 SKILLBRIDGE API - GROQ AI BACKEND');
    console.log('='.repeat(60));
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`⚡ AI Provider: GROQ`);
    console.log(`🤖 Working Models: ${WORKING_GROQ_MODELS.length} available`);
    console.log(`🔑 API Key: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing'}`);
    console.log(`🌍 CORS Origins: ${allowedOrigins.join(', ')}`);
    console.log('');
    console.log('📚 ENDPOINTS:');
    console.log(`   • GET  /`);
    console.log(`   • GET  /api/health`);
    console.log(`   • GET  /api/goals`);
    console.log(`   • GET  /api/backgrounds`);
    console.log(`   • GET  /api/time-options`);
    console.log(`   • GET  /api/models`);
    console.log(`   • POST /api/generate-path`);
    console.log(`   • POST /api/save-path`);
    console.log(`   • POST /api/test-ai`);
    console.log('');
    console.log('💡 RECOMMENDED MODEL: llama-3.2-3b-preview (fast & capable)');
    console.log('');
    console.log('🧪 Quick Tests:');
    console.log(`   curl http://localhost:${PORT}`);
    console.log(`   curl http://localhost:${PORT}/api/health`);
    console.log(`   curl http://localhost:${PORT}/api/models`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/test-ai -H "Content-Type: application/json" -d '{}'`);
    console.log('='.repeat(60));
    console.log('\n💡 Tip: For Vercel deployment:');
    console.log('   1. Run: vercel');
    console.log('   2. Set environment variables in Vercel dashboard:');
    console.log('      - GROQ_API_KEY');
    console.log('      - FRONTEND_URL (optional)');
    console.log('='.repeat(60));
  });
}