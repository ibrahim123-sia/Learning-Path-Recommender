import React from 'react';
import ResourceCard from './ResourceCard';

const RoadmapDisplay = ({ roadmapData }) => {
  if (!roadmapData) return null;

  // Ensure we have proper week structure
  const formatWeeks = (weeks) => {
    if (!weeks || !Array.isArray(weeks)) {
      // Return default weeks if none provided
      return Array.from({ length: 4 }, (_, i) => ({
        weekNumber: i + 1,
        title: `Week ${i + 1}: Learning Phase ${i + 1}`,
        description: "Weekly learning objectives and topics",
        topics: ["Topic 1", "Topic 2", "Topic 3"],
        resources: [
          {
            type: "article",
            title: "Learning Resource",
            description: "Educational content for this week",
            duration: "3-4 hours",
            free: true,
            link: "https://example.com"
          }
        ],
        milestone: `Complete week ${i + 1} learning objectives`
      }));
    }

    return weeks.map((week, index) => ({
      weekNumber: week.weekNumber || index + 1,
      title: week.title || `Week ${index + 1}: Learning`,
      description: week.description || "Weekly learning content",
      topics: Array.isArray(week.topics) ? week.topics : ["Core Concepts", "Practice Exercises"],
      resources: (Array.isArray(week.resources) ? week.resources : []).map(resource => ({
        type: resource.type || "article",
        title: resource.title || "Learning Resource",
        description: resource.description || "Educational content",
        duration: resource.duration || "2-3 hours",
        free: resource.free !== undefined ? resource.free : true,
        link: resource.link || "https://example.com"
      })),
      milestone: week.milestone || `Complete week ${index + 1} objectives`
    }));
  };

  const formattedWeeks = formatWeeks(roadmapData.weeks);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Personalized Learning Path</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Goal: {roadmapData.goal}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {roadmapData.timeCommitment || '10-15 hours'}/week
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {roadmapData.background || 'Beginner'} level
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            {formattedWeeks.length} weeks
          </span>
        </div>
        <p className="text-gray-600">{roadmapData.description || 'Your personalized learning path'}</p>
      </div>

      {/* Weekly Roadmap */}
      <div className="space-y-8">
        {formattedWeeks.map((week, weekIndex) => (
          <div key={weekIndex} className="border-l-4 border-blue-500 pl-6 relative">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{week.weekNumber}</span>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{week.title}</h3>
              <p className="text-gray-600">{week.description}</p>
            </div>

            {/* Weekly Topics */}
            {week.topics.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Key Topics:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {week.topics.map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resources */}
            {week.resources.length > 0 ? (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Recommended Resources:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {week.resources.map((resource, resourceIndex) => (
                    <ResourceCard key={resourceIndex} resource={resource} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Resources will be suggested based on your progress</p>
              </div>
            )}

            {/* Milestone */}
            {week.milestone && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-yellow-800">Week {week.weekNumber} Milestone:</span>
                    <p className="text-yellow-700">{week.milestone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Steps */}
      {roadmapData.nextSteps && roadmapData.nextSteps.length > 0 && (
        <div className="mt-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Your Next Steps</h3>
          <ol className="space-y-3">
            {roadmapData.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Summary</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Weeks: {formattedWeeks.length}</span>
            <span className="text-gray-600">Estimated Time: {roadmapData.timeCommitment || '10-15 hours'}/week</span>
            <span className="text-gray-600">Level: {roadmapData.background || 'Beginner'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;