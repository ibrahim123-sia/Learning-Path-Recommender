# SkillBridge - AI Learning Path Recommender

## 📋 Project Description
SkillBridge is an AI-powered learning assistant that helps users move from their current skill level to defined learning goals. The system generates personalized 4-6 week learning roadmaps based on user inputs, providing focused, realistic sequences of topics rather than overwhelming resource lists.

## 🎯 Key Features
- AI-generated personalized learning paths
- Input: Current skills, background, time availability
- Output: Prioritized 4-6 week roadmap with specific resources
- Curated content from real platforms (YouTube, Coursera, freeCodeCamp, etc.)
- Clear starting points and immediate next steps

## 🏗️ Architecture
- **Frontend**: React.js + Tailwind CSS + Axios
- **Backend**: Node.js + Express.js
- **AI Integration**: Google Gemini / Groq AI / OpenRouter
- **Deployment**: Vercel-ready

## 🚀 How to Run It

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- AI API Key (Gemini, Groq, or OpenRouter)


# Example Input/Output

## Example Input 1: Web Development

    {
  "goal": "Become a Junior Web Developer",
  "background": "beginner",
  "timeCommitment": "10-15 hours/week",
  "currentSkills": "HTML basics"
}

## Example Output 1:

{
  "goal": "Become a Junior Web Developer",
  "background": "beginner",
  "timeCommitment": "10-15 hours/week",
  "description": "A 4-week comprehensive web development path...",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: HTML & CSS Mastery",
      "description": "Learn fundamental web technologies",
      "topics": ["HTML5", "CSS3", "Flexbox", "Responsive Design"],
      "resources": [
        {
          "type": "course",
          "title": "freeCodeCamp Responsive Web Design",
          "description": "Interactive coding certification",
          "duration": "20 hours",
          "link": "https://freecodecamp.org",
          "free": true
        }
      ],
      "milestone": "Build a responsive personal portfolio page"
    }
  ],
  "nextSteps": ["Complete Week 1", "Join web dev community"],
  "duration": "4 weeks",
  "generatedAt": "2024-01-15T10:30:00Z"
}

## Example Input 2: Data Analysis
 {
  "goal": "Learn Data Analysis",
  "background": "some_exp",
  "timeCommitment": "5-10 hours/week",
  "currentSkills": "Python basics, Excel"
}

## Example Output 2:

{
  "goal": "Learn Data Analysis",
  "background": "some_exp",
  "timeCommitment": "5-10 hours/week",
  "description": "5-week data analysis learning path...",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "Week 1: Python for Data Analysis",
      "description": "Master Python data manipulation",
      "topics": ["Pandas", "NumPy", "Data Cleaning", "Basic Analysis"],
      "resources": [
        {
          "type": "course",
          "title": "Data Analysis with Python - Kaggle",
          "description": "Practical data analysis course",
          "duration": "15 hours",
          "link": "https://kaggle.com/learn",
          "free": true
        }
      ],
      "milestone": "Clean and analyze a dataset using Python"
    }
  ],
  "duration": "5 weeks",
  "generatedAt": "2024-01-15T10:35:00Z"
}




