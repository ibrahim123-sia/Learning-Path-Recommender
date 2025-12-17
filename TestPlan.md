
---

## **TestPlan.md**

```markdown
# SkillBridge - Test Plan

## 📋 Test Strategy
This document outlines test cases for the Learning Path Recommender system, covering normal, positive, negative, and edge cases.

## 🧪 Test Environment
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **AI Provider**: Google Gemini / Groq AI
- **Browser**: Chrome v120+

## 🔍 Test Cases

### Test Case 1: Normal Flow - Web Development Path
**Description**: Standard user journey for web development learning path

**Input Data**:
```json
{
  "goal": "Become a Junior Web Developer",
  "background": "beginner",
  "timeCommitment": "10-15 hours/week",
  "currentSkills": "HTML basics"
}

Test Steps:

Navigate to frontend homepage

Click "Create Path" button

Select goal from dropdown

Choose background level

Select time commitment

Enter current skills

Click "Generate Learning Path"

Wait for response

Verify path display


Expected Result:

Response time: < 5 seconds

Status code: 200 OK

Response contains valid JSON with:

goal field matching input

weeks array with 4-6 items

Each week has title, description, topics, resources, milestone

duration field present

generatedAt timestamp

nextSteps array

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Response Time: _____ seconds

Notes: _____

Test Case 2: Positive Case - Data Analysis with Experience
Description: User with some experience requesting specialized path

Input Data:

{
  "goal": "Learn Data Analysis",
  "background": "intermediate",
  "timeCommitment": "15-20 hours/week",
  "currentSkills": "Python, SQL, Excel, Statistics"
}

Expected Result:

Response time: < 5 seconds

Status code: 200 OK

Response contains:

Advanced topics appropriate for intermediate level

5-6 weeks (more time commitment = more weeks)

Technical resources (Kaggle, DataCamp, etc.)

Complex milestones matching skill level

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Response Time: _____ seconds

Notes: _____

Test Case 3: Negative Case - Missing Required Fields
Description: Test system validation for incomplete inputs

Input Data:

{
  "goal": "Become a UI/UX Designer",
  "background": "",
  "timeCommitment": "5-10 hours/week",
  "currentSkills": "Photoshop basics"
}

Expected Result:

Status code: 400 Bad Request

Error message: "Missing required fields"

Specific mention of missing field(s)

No learning path generated

Frontend displays user-friendly error

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Error Message: _____

Notes: _____


Test Case 4: Edge Case - Maximum Time Commitment
Description: User with maximum available time (20+ hours/week)

Input Data:

json
{
  "goal": "Master Python Programming",
  "background": "professional",
  "timeCommitment": "20+ hours/week",
  "currentSkills": "JavaScript, Java, C++, Algorithms"
}
Expected Result:

Status code: 200 OK

Response contains 6 weeks (maximum duration)

Each week has substantial content (8-10 hours/week)

Advanced topics and projects

Professional-level resources and milestones

Comprehensive next steps

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Week Count: _____

Notes: _____

Test Case 5: Edge Case - Empty Skills & Quick Path
Description: Complete beginner with no current skills requesting quick learning

Input Data:

json
{
  "goal": "Learn Mobile App Development",
  "background": "beginner",
  "timeCommitment": "5-10 hours/week",
  "currentSkills": ""
}
Expected Result:

Status code: 200 OK

Response contains 4 weeks (minimum for 5-10 hours)

Very basic starting topics

Beginner-friendly resources (lots of free options)

Simple, achievable milestones

Encouraging next steps for beginners

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Week Count: _____

Free Resources: _____

Notes: _____

Test Case 6: System Test - API Health Check
Description: Verify backend service availability

Test Steps:

bash
curl -X GET http://localhost:5000/api/health
Expected Result:

Status code: 200 OK

Response: {"status": "healthy", "service": "SkillBridge API", "timestamp": "..."}

Response time: < 1 second

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Response Time: _____ seconds

Notes: _____

Test Case 7: Integration Test - Frontend-Backend Communication
Description: Test complete flow from UI to API response

Test Steps:

Frontend loads available goals from /api/goals

Frontend loads backgrounds from /api/backgrounds

Frontend loads time options from /api/time-options

User submits form

Frontend sends POST to /api/generate-path

Backend processes and returns path

Frontend displays path correctly

Expected Result:

All API calls succeed (200 OK)

Dropdowns populated with correct options

Form validation works

Path displays with proper formatting

Loading states shown during API calls

Error handling for failed requests

Actual Result:
[To be filled during testing]

Status: □ Pass □ Fail

Issues Encountered: _____

Notes: _____

📊 Test Metrics
Performance Requirements:
API response time: < 5 seconds (with AI)

Page load time: < 3 seconds

Error rate: < 1%

Uptime: > 99%

Success Criteria:
All test cases pass

No critical bugs

User journey complete without errors

Responsive design works on mobile/desktop

🐛 Bug Reporting Template
markdown
**Bug Title**: [Brief description]
**Severity**: [Critical/Major/Minor]
**Environment**: [Browser/Device/OS]
**Steps to Reproduce**:
1. 
2. 
3. 
**Expected Behavior**:
**Actual Behavior**:
**Screenshots**:
**Additional Context**:
✅ Test Completion Checklist
All API endpoints tested

Frontend components tested

Error handling verified

Performance requirements met

Mobile responsiveness checked

Documentation updated

Deployment verified