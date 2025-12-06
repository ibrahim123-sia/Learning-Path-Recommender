import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const HomePage = () => {
  const [stats, setStats] = useState({ generatedPaths: 0, averageWeeks: 4 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetch(`${API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log('API Health:', data);
        // For demo, we'll use mock stats since you don't have a stats endpoint
        setStats({ generatedPaths: 1247, averageWeeks: 5 });
        setLoading(false);
      })
      .catch(err => {
        console.error('API Error:', err);
        setStats({ generatedPaths: 1247, averageWeeks: 5 });
        setLoading(false);
      });
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Personalized Paths',
      description: 'AI-generated roadmaps tailored to your goals and background'
    },
    {
      icon: (
        <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Time-Optimized',
      description: '4-6 week plans based on your weekly availability'
    },
    {
      icon: (
        <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Progress Tracking',
      description: 'Clear milestones and weekly objectives'
    },
    {
      icon: (
        <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 01-4 4m4-4a4 4 0 00-4-4m4 4h1m-13-4a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Expert Resources',
      description: 'Curated content from top learning platforms'
    }
  ];

  const popularGoals = [
    { title: 'Web Development', color: 'bg-blue-100 text-blue-800' },
    { title: 'Data Science', color: 'bg-green-100 text-green-800' },
    { title: 'Mobile Apps', color: 'bg-purple-100 text-purple-800' },
    { title: 'UI/UX Design', color: 'bg-pink-100 text-pink-800' },
    { title: 'DevOps', color: 'bg-orange-100 text-orange-800' },
    { title: 'Cloud Computing', color: 'bg-indigo-100 text-indigo-800' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          AI-Powered Learning Paths
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          From <span className="text-blue-600">Zero</span> to{' '}
          <span className="text-blue-600">Hero</span> with AI Guidance
        </h1>
        
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Get personalized 4-6 week learning roadmaps tailored to your skills, goals, 
          and schedule. No more guesswork—just clear, actionable steps.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            to="/create" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center text-lg"
          >
            Create Your Path
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <a 
            href="#how-it-works" 
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 transition-colors"
          >
            Learn More
          </a>
        </div>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {loading ? '...' : stats.generatedPaths.toLocaleString()}+
            </div>
            <div className="text-gray-600">Paths Generated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {loading ? '...' : stats.averageWeeks}
            </div>
            <div className="text-gray-600">Week Average</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            {feature.icon}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Set Your Goals', desc: 'Choose your learning objective and background' },
            { step: '2', title: 'AI Generation', desc: 'Get a personalized 4-6 week roadmap' },
            { step: '3', title: 'Start Learning', desc: 'Follow weekly milestones and resources' }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Goals */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Learning Goals</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {popularGoals.map((goal, index) => (
            <span 
              key={index} 
              className={`${goal.color} px-4 py-2 rounded-full font-medium hover:scale-105 transition-transform cursor-default`}
            >
              {goal.title}
            </span>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Start Your Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;