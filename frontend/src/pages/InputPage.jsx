import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserInputForm from '../components/UserInputForm';

const API_BASE_URL = 'https://learning-path-recommender.vercel.app/api';

const InputPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    goals: [],
    backgrounds: [],
    timeOptions: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch options from API
    const fetchOptions = async () => {
      try {
        const [goalsRes, backgroundsRes, timeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/goals`).then(res => res.json()),
          fetch(`${API_BASE_URL}/backgrounds`).then(res => res.json()),
          fetch(`${API_BASE_URL}/time-options`).then(res => res.json())
        ]);

        setOptions({
          goals: goalsRes || [],
          backgrounds: backgroundsRes || [],
          timeOptions: timeRes || []
        });
      } catch (err) {
        console.error('Failed to load options:', err);
        setError('Failed to load options. Please refresh the page.');
        // Set default options as fallback
        setOptions({
          goals: ['Become a Junior Web Developer', 'Learn Data Analysis', 'Master Python Programming'],
          backgrounds: [
            { id: 'beginner', label: 'Complete Beginner' },
            { id: 'some_exp', label: 'Some Experience' },
            { id: 'intermediate', label: 'Intermediate' },
            { id: 'professional', label: 'Professional' }
          ],
          timeOptions: [
            { id: '5-10', label: '5-10 hours/week' },
            { id: '10-15', label: '10-15 hours/week' },
            { id: '15-20', label: '15-20 hours/week' },
            { id: '20+', label: '20+ hours/week' }
          ]
        });
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Map form data to match your backend
      const requestData = {
        goal: formData.goal,
        background: formData.background,
        timeCommitment: formData.hoursPerWeek,
        currentSkills: formData.currentSkills || ''
      };

      // Call your backend API
      const response = await fetch(`${API_BASE_URL}/generate-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate path');
      }

      const roadmap = await response.json();
      navigate('/result', { state: { roadmap } });
      
    } catch (err) {
      console.error('Error generating path:', err);
      setError('Failed to generate learning path. Please try again.');
      
      // Fallback to mock data if API fails
      setTimeout(() => {
        const mockRoadmap = generateMockRoadmap(formData);
        navigate('/result', { state: { roadmap: mockRoadmap } });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRoadmap = (formData) => {
    const timeMap = {
      '1-5': '5-8 hours',
      '5-10': '10-15 hours', 
      '10-15': '15-20 hours',
      '15-20': '20-25 hours',
      '20+': '25+ hours'
    };

    const backgroundMap = {
      'beginner': 'Beginner',
      'some_knowledge': 'Some Knowledge',
      'related_field': 'Related Field',
      'professional': 'Professional'
    };

    return {
      goal: formData.goal,
      description: `A personalized ${formData.goal.toLowerCase()} learning path designed for ${backgroundMap[formData.background]} level.`,
      background: backgroundMap[formData.background],
      timeCommitment: timeMap[formData.hoursPerWeek] || '10-15 hours',
      duration: '6 weeks',
      weeks: [
        {
          weekNumber: 1,
          title: 'Week 1: Foundation & Basics',
          description: 'Learn the fundamental concepts and set up your development environment.',
          topics: ['Core Concepts', 'Setup & Installation', 'Basic Syntax', 'Hello World Project'],
          resources: [
            {
              type: 'video',
              title: 'Complete Beginner Tutorial',
              description: 'Step-by-step guide for absolute beginners',
              duration: '2.5 hours',
              free: true,
              link: 'https://www.freecodecamp.org'
            },
            {
              type: 'article',
              title: 'Official Documentation',
              description: 'Comprehensive reference guide',
              duration: '1 hour',
              free: true,
              link: 'https://developer.mozilla.org'
            }
          ],
          milestone: 'Complete first small project and understand basic concepts'
        },
        {
          weekNumber: 2,
          title: 'Week 2: Core Concepts Deep Dive',
          description: 'Master the essential building blocks and patterns.',
          topics: ['Data Structures', 'Control Flow', 'Functions', 'Error Handling'],
          resources: [
            {
              type: 'course',
              title: 'Intermediate Concepts Course',
              description: 'Deep dive into core concepts',
              duration: '4 hours',
              free: false,
              link: 'https://www.coursera.org'
            },
            {
              type: 'article',
              title: 'Practice Exercises',
              description: 'Hands-on coding challenges',
              duration: '3 hours',
              free: true,
              link: 'https://leetcode.com'
            }
          ],
          milestone: 'Build a functional application with core concepts'
        }
      ],
      nextSteps: [
        'Start with Week 1 materials immediately',
        'Set aside dedicated study time each day',
        'Join relevant online communities for support'
      ]
    };
  };

  // Pass options to UserInputForm
  const enhancedFormProps = {
    onSubmit: handleSubmit,
    loading: loading,
    options: options
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Learning Path</h1>
        <p className="text-gray-600">Fill in your details to get a personalized roadmap</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <UserInputForm {...enhancedFormProps} />
          
          {loading && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700">Generating your personalized learning path...</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Why Personalized?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Saves 40% learning time</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>No information overload</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Focus on your skill gaps</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Tips for Success</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Be honest about your current skills</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Choose realistic time commitments</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Review the roadmap weekly</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Don't skip the milestones</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Our AI analyzes thousands of successful learning paths to create your optimal roadmap.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View sample paths →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPage;