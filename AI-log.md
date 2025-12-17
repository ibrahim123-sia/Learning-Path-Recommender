AI Tools & Integrity Documentation Project: Learning Path Recommender
System Student: \[Your Name\] Date: \[Current Date\] Course: \[Your
Course Name\]

1.  List of AI Tools Used Tool Purpose Version/Model ChatGPT (OpenAI)
    Code generation, debugging, architecture design GPT-4 Google Gemini
    API Learning path generation, AI content creation gemini-pro /
    gemini-1.5-pro GitHub Copilot Code completion, syntax suggestions
    N/A Claude AI Alternative approach validation Claude-3 DeepSeek Code
    optimization suggestions Latest version

2.  Complete Prompt History with Usage Documentation

Phase 1: Project Architecture & Setup

Prompt 1: Initial Project Setup text "Create a React project with
Tailwind CSS. In the src folder, make two more folders: one for pages
and one for components. Build JSX files for my Learning Path Recommender
project with the following requirements..."

**Purpose:** Initialize project structure and create basic component
layout\
**Date:** \[Date of creation\]\
**Generated Files:**\
- src/components/Header.jsx\
- src/components/ResourceCard.jsx\
- src/components/RoadmapDisplay.jsx\
- src/components/UserInputForm.jsx\
- src/pages/HomePage.jsx\
- src/pages/InputPage.jsx\
- src/pages/ResultPage.jsx\
- src/App.jsx\
- src/index.js\
- src/index.css

Prompt 2: Professional Code Refinement text "Create all these files
again professionally with the following specifications: Header with
specific styling, ResourceCard with SVG icons, RoadmapDisplay with week
cards..."

**Purpose:** Improve code quality, add professional UI elements,
implement proper component structure\
**Date:** \[Date of refinement\]\
**Key Improvements:**\
- Added SVG icons for resource types\
- Implemented responsive design patterns\
- Added loading states and animations\
- Improved error handling

Phase 2: Backend Integration

Prompt 3: Backend API Development text "Align my backend with frontend.
I have an Express.js backend with Gemini API integration. Create a
complete backend that: 1. Takes user input 2. Generates learning paths
3. Returns 4-6 week roadmaps..."

**Purpose:** Create a functional backend API that integrates with Gemini
AI\
**Date:** \[Date of backend creation\]\
**Generated Code:**\
- Backend/server.js with Express.js\
- API endpoints for goals, backgrounds, time options\
- Gemini AI integration for path generation\
- Error handling and fallback mechanisms

Prompt 4: API Error Resolution\
text\
"PS D:`\Learning`{=tex}-Path-Recommender\> ... Error:
models/gemini-1.5-flash is not found for API version v1beta..."

**Purpose:** Debug and fix Gemini API integration issues\
**Date:** \[Date of debugging\]\
**Solution Applied:**\
- Added model fallback mechanism\
- Implemented mock data for API failures\
- Added comprehensive error logging

Phase 3: Frontend-Backend Integration

Prompt 5: API Integration Issues\
text\
"Everything is working but it's only showing 2 weeks. We need a wide
range meaning 4-6 weeks for each roadmap..."

**Purpose:** Fix the issue where Gemini AI was returning only 2 weeks
instead of 4-6\
**Date:** \[Date of issue resolution\]\
**Solution:**\
- Enhanced prompt engineering for Gemini API\
- Added week validation and augmentation\
- Implemented fallback weeks generation

Prompt 6: Page Refresh Issue\
text\
"OK everything working but one issue: when I refresh, why the page is
not reload?"

**Purpose:** Fix page refresh issue where React Router state was lost\
**Date:** \[Date of fix\]\
**Solution:**\
- Implemented localStorage persistence\
- Added data recovery on page refresh\
- Created loading states and error handling for missing data

Phase 4: Code Optimization & Features

Prompt 7: Direct API Integration Request\
text\
"Don't use fallback. I want the API to work directly without mock
data..."

**Purpose:** Optimize backend to work primarily with Gemini API\
**Date:** \[Date of optimization\]\
**Changes Made:**\
- Removed unnecessary fallback logic\
- Simplified error handling\
- Improved prompt structure for better AI responses

Prompt 8: Professional Component Structure\
text\
"OK I don't want this type, use API in each file..."

**Purpose:** Implement direct API calls in each component instead of
context/provider pattern\
**Date:** \[Date of implementation\]\
**Implementation:**\
- Added fetch API calls directly in components\
- Implemented loading states in each component\
- Added proper error handling

3.  Specific AI-Generated Code Sections

3.1 Gemini API Integration Code

``` javascript
const modelNames = ['gemini-pro', 'gemini-1.0-pro', 'gemini-1.5-pro'];
let model;
let lastError;

for (const modelName of modelNames) {
  try {
    model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      }
    });
    console.log(`Using model: ${modelName}`);
    break;
  } catch (error) {
    lastError = error;
    console.log(`Model ${modelName} not available, trying next...`);
  }
}
```

3.2 Enhanced AI Prompt for 4-6 Weeks

``` javascript
const prompt = `Create a comprehensive 4-6 week learning path in JSON format. You MUST return exactly 4-6 weeks.
...
`;
```

3.3 localStorage Implementation

``` javascript
const loadRoadmap = () => { ... };
```

4.  AI-Assisted Debugging Sessions\

-   API Key Issue\
-   Model Not Found Error\
-   React Router State Loss\
-   CORS Issues

5.  Learning Outcomes\

-   React state persistence\
-   Express.js AI integration\
-   Error handling\
-   Prompt engineering
