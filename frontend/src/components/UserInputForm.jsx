import React, { useState, useEffect } from 'react';

const UserInputForm = ({ onSubmit, loading, options = {} }) => {
  const [formData, setFormData] = useState({
    goal: '',
    currentSkills: '',
    background: 'beginner',
    hoursPerWeek: '5-10'
  });
  
  const [customGoal, setCustomGoal] = useState('');
  const [useCustomGoal, setUseCustomGoal] = useState(false);

  // Use options from props or defaults
  const goals = options.goals || [
    'Become a Junior Web Developer',
    'Learn Data Analysis',
    'Master Python',
    'Become UI/UX Designer',
    'Learn Mobile Development',
    'Master ML Basics'
  ];

  const backgrounds = options.backgrounds || [
    { id: 'beginner', label: 'Complete Beginner' },
    { id: 'some_exp', label: 'Some Experience' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'professional', label: 'Professional' }
  ];

  const timeOptions = options.timeOptions || [
    { id: '5-10', label: '5-10 hours/week' },
    { id: '10-15', label: '10-15 hours/week' },
    { id: '15-20', label: '15-20 hours/week' },
    { id: '20+', label: '20+ hours/week' }
  ];

  useEffect(() => {
    // Set initial values when options are loaded
    if (goals.length > 0 && !formData.goal) {
      setFormData(prev => ({ ...prev, goal: goals[0] }));
    }
    if (backgrounds.length > 0 && backgrounds[0].id) {
      setFormData(prev => ({ ...prev, background: backgrounds[0].id }));
    }
    if (timeOptions.length > 0 && timeOptions[0].id) {
      setFormData(prev => ({ ...prev, hoursPerWeek: timeOptions[0].id }));
    }
  }, [goals, backgrounds, timeOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'goal' && useCustomGoal) {
      // Don't update goal from dropdown when custom is active
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomGoalChange = (e) => {
    const value = e.target.value;
    setCustomGoal(value);
    setFormData(prev => ({
      ...prev,
      goal: value
    }));
  };

  const handleToggleCustomGoal = () => {
    if (useCustomGoal) {
      // Switching back to dropdown
      setUseCustomGoal(false);
      if (goals.length > 0) {
        setFormData(prev => ({ ...prev, goal: goals[0] }));
      }
    } else {
      // Switching to custom input
      setUseCustomGoal(true);
      setFormData(prev => ({ ...prev, goal: customGoal }));
    }
  };

  const handleBackgroundChange = (value) => {
    setFormData(prev => ({
      ...prev,
      background: value
    }));
  };

  const handleTimeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      hoursPerWeek: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate goal is not empty
    if (!formData.goal.trim()) {
      alert('Please enter or select a learning goal');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Selection with Custom Option */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Learning Goal *
            </label>
            <button
              type="button"
              onClick={handleToggleCustomGoal}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              disabled={loading}
            >
              {useCustomGoal ? '← Choose from list' : 'Or type your own'}
            </button>
          </div>

          {useCustomGoal ? (
            <div className="space-y-2">
              <input
                type="text"
                value={customGoal}
                onChange={handleCustomGoalChange}
                placeholder="Enter your custom learning goal"
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500">
                Examples: "Learn React Native", "Master Data Science", "Become a Cybersecurity Expert"
              </p>
            </div>
          ) : (
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              required
              disabled={loading || goals.length === 0}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select a goal</option>
              {goals.map((goal, i) => (
                <option key={i} value={goal}>{goal}</option>
              ))}
            </select>
          )}
          
          {!useCustomGoal && goals.length === 0 && !loading && (
            <p className="text-sm text-gray-500 mt-1">Loading goals...</p>
          )}
        </div>

        {/* Current Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Skills (Optional)
          </label>
          <textarea
            name="currentSkills"
            value={formData.currentSkills}
            onChange={handleChange}
            placeholder="e.g., HTML, Python, JavaScript, React, SQL, etc."
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none transition-colors"
          />
        </div>

        {/* Background */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => handleBackgroundChange(bg.id)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  formData.background === bg.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-blue-300'
                }`}
                disabled={loading}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
                    formData.background === bg.id 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-400'
                  }`}>
                    {formData.background === bg.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm">{bg.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Commitment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time per Week *
          </label>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((time) => (
              <button
                key={time.id}
                type="button"
                onClick={() => handleTimeChange(time.id)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  formData.hoursPerWeek === time.id 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'border-gray-300 hover:border-blue-300 text-gray-700'
                }`}
                disabled={loading}
              >
                <span className="text-sm">{time.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.goal.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : 'Generate Path'}
        </button>
      </form>
    </div>
  );
};

export default UserInputForm;