import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Mic, MicOff, Play, Pause, BarChart3, Plus, Edit, Trash2, CheckCircle, Circle, Clock, Trophy, TrendingUp, Calendar, MessageSquare, Volume2, Save, X, Star, Code, Brain, Lightbulb, Award, Flame } from 'lucide-react';

const DSALearningPlatform = () => {
  // Enhanced State Management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dsaTopics, setDsaTopics] = useState([
    {
      id: 1,
      name: 'Arrays & Strings',
      category: 'Basic',
      status: 'completed',
      progress: 100,
      concepts: ['Array traversal', 'Two pointer technique', 'Sliding window', 'Binary search'],
      examples: ['Two Sum', 'Maximum Subarray', 'Longest Substring', 'Merge Intervals'],
      notes: 'Master the fundamentals - arrays are everywhere! Focus on space-time complexity.',
      timeSpent: 25,
      difficulty: 'Easy',
      lastStudied: '2024-08-05'
    },
    {
      id: 2,
      name: 'Linked Lists',
      category: 'Basic',
      status: 'in-progress',
      progress: 65,
      concepts: ['Singly linked list', 'Doubly linked list', 'Cycle detection', 'Reverse operations'],
      examples: ['Reverse Linked List', 'Merge Two Lists', 'Detect Cycle', 'Remove Nth Node'],
      notes: 'Focus on pointer manipulation and edge cases. Draw diagrams for complex operations.',
      timeSpent: 18,
      difficulty: 'Medium',
      lastStudied: '2024-08-06'
    },
    {
      id: 3,
      name: 'Stacks & Queues',
      category: 'Basic',
      status: 'in-progress',
      progress: 80,
      concepts: ['Stack operations', 'Queue operations', 'Priority queues', 'Monotonic stack'],
      examples: ['Valid Parentheses', 'Next Greater Element', 'Implement Queue using Stacks'],
      notes: 'LIFO vs FIFO principles. Great for parsing and backtracking problems.',
      timeSpent: 12,
      difficulty: 'Easy',
      lastStudied: '2024-08-04'
    },
    {
      id: 4,
      name: 'Trees & Binary Search Trees',
      category: 'Intermediate',
      status: 'in-progress',
      progress: 40,
      concepts: ['Tree traversals', 'BST properties', 'Balanced trees', 'Tree construction'],
      examples: ['Inorder Traversal', 'Validate BST', 'Lowest Common Ancestor', 'Serialize Tree'],
      notes: 'Recursion is key here. Practice tree problems daily. Understand the invariants.',
      timeSpent: 22,
      difficulty: 'Medium',
      lastStudied: '2024-08-03'
    },
    {
      id: 5,
      name: 'Heaps & Priority Queues',
      category: 'Intermediate',
      status: 'not-started',
      progress: 0,
      concepts: [],
      examples: [],
      notes: '',
      timeSpent: 0,
      difficulty: 'Medium',
      lastStudied: null
    },
    {
      id: 6,
      name: 'Dynamic Programming',
      category: 'Advanced',
      status: 'not-started',
      progress: 0,
      concepts: [],
      examples: [],
      notes: '',
      timeSpent: 0,
      difficulty: 'Hard',
      lastStudied: null
    },
    {
      id: 7,
      name: 'Graphs',
      category: 'Advanced',
      status: 'not-started',
      progress: 0,
      concepts: [],
      examples: [],
      notes: '',
      timeSpent: 0,
      difficulty: 'Hard',
      lastStudied: null
    },
    {
      id: 8,
      name: 'Backtracking',
      category: 'Advanced',
      status: 'not-started',
      progress: 0,
      concepts: [],
      examples: [],
      notes: '',
      timeSpent: 0,
      difficulty: 'Hard',
      lastStudied: null
    }
  ]);

  // Modal and Form States
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [newConcept, setNewConcept] = useState('');
  const [newExample, setNewExample] = useState('');
  
  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  
  // Dashboard States
  const [studyStreak, setStudyStreak] = useState(12);
  const [totalTimeSpent, setTotalTimeSpent] = useState(77);
  const [showCelebration, setShowCelebration] = useState(false);

  // Form for new/edit topic
  const [topicForm, setTopicForm] = useState({
    name: '',
    category: 'Basic',
    difficulty: 'Easy',
    notes: ''
  });

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      const data = {
        dsaTopics,
        studyStreak,
        totalTimeSpent,
        lastSaved: new Date().toISOString()
      };
      // In a real app, this would save to localStorage or backend
      console.log('Auto-saving data...', data);
    };

    const interval = setInterval(saveData, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [dsaTopics, studyStreak, totalTimeSpent]);

  // Enhanced Voice Assistant
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceInput('');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        handleVoiceQuery(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setAiResponse("Sorry, I couldn't hear you clearly. Please try again.");
      };
      
      recognition.start();
    } else {
      setAiResponse("Speech recognition is not supported in this browser. Try Chrome or Edge!");
    }
  };

  const handleVoiceQuery = (query) => {
    const timestamp = new Date().toLocaleTimeString();
    setChatHistory(prev => [...prev, { type: 'user', message: query, timestamp }]);
    
    // Enhanced AI Response Logic
    let response = generateAIResponse(query.toLowerCase());
    
    setAiResponse(response);
    setChatHistory(prev => [...prev, { type: 'ai', message: response, timestamp }]);
    speakResponse(response);
  };

  const generateAIResponse = (query) => {
    const completedCount = dsaTopics.filter(t => t.status === 'completed').length;
    const inProgressCount = dsaTopics.filter(t => t.status === 'in-progress').length;
    const totalProgress = Math.round(dsaTopics.reduce((sum, topic) => sum + topic.progress, 0) / dsaTopics.length);
    
    // Context-aware responses
    if (query.includes('progress') || query.includes('how am i doing')) {
      return `Excellent progress! You've completed ${completedCount} topics and have ${inProgressCount} in progress. Your overall progress is ${totalProgress}% with a ${studyStreak}-day study streak. You've spent ${totalTimeSpent} hours total - keep up the fantastic work!`;
    }
    
    if (query.includes('array') || query.includes('string')) {
      const arrayTopic = dsaTopics.find(t => t.name.includes('Array'));
      if (arrayTopic?.status === 'completed') {
        return "Great! You've mastered arrays. Key patterns include two pointers, sliding window, and prefix sums. Ready to tackle more advanced problems like 3Sum or Trapping Rain Water?";
      }
      return "Arrays are the foundation of DSA! Focus on two-pointer techniques, sliding window patterns, and understanding time complexity. Start with simple traversal problems and work up to advanced patterns.";
    }
    
    if (query.includes('linked list')) {
      return "Linked lists teach pointer manipulation! Key concepts: reversing, detecting cycles, and merging. Always check for null pointers and practice with dummy nodes. Want me to suggest some specific problems?";
    }
    
    if (query.includes('tree') || query.includes('binary')) {
      return "Trees are hierarchical powerhouses! Master the three traversals (inorder, preorder, postorder) and understand recursion deeply. Binary Search Trees have the ordering property - left < root < right.";
    }
    
    if (query.includes('dynamic programming') || query.includes('dp')) {
      return "DP is about optimal subproblems! Start with 1D problems like climbing stairs, then move to 2D like unique paths. Remember: identify state, recurrence relation, base cases, and optimize space if possible.";
    }
    
    if (query.includes('graph')) {
      return "Graphs model relationships! Master BFS (shortest path, level-order) and DFS (connectivity, cycle detection). Learn adjacency lists vs matrices, and practice with real problems like course scheduling.";
    }
    
    if (query.includes('stack') || query.includes('queue')) {
      return "Stacks (LIFO) are perfect for parsing, backtracking, and monotonic problems. Queues (FIFO) excel at BFS and sliding window maximums. Both are essential tools in your DSA toolkit!";
    }
    
    if (query.includes('what next') || query.includes('study next')) {
      const nextTopic = dsaTopics.find(t => t.status === 'not-started');
      if (nextTopic) {
        return `I recommend starting with "${nextTopic.name}" next! It's marked as ${nextTopic.difficulty} difficulty. Based on your current progress, you're ready for this challenge.`;
      }
      return "You're doing amazingly! Focus on strengthening your in-progress topics and practicing more problems. Consider revisiting completed topics with harder variations.";
    }
    
    if (query.includes('time') || query.includes('complexity')) {
      return "Time complexity measures algorithm efficiency! Common patterns: O(1) constant, O(log n) binary search, O(n) linear, O(n log n) efficient sorting, O(n²) nested loops. Space complexity matters too!";
    }
    
    if (query.includes('motivation') || query.includes('difficult') || query.includes('hard')) {
      return `You're on a ${studyStreak}-day streak - that's dedication! Every expert was once a beginner. Break complex problems into smaller parts, use visualizations, and remember: struggling means you're growing. You've got this! 💪`;
    }
    
    // Default encouraging response
    const encouragements = [
      `You're doing fantastic with your ${studyStreak}-day streak! Keep pushing forward.`,
      `With ${totalProgress}% overall progress, you're well on your way to DSA mastery!`,
      `Remember, every algorithm you learn is a tool in your problem-solving toolkit.`,
      "Consistent practice beats perfection. You're building something amazing!"
    ];
    
    return encouragements[Math.floor(Math.random() * encouragements.length)] + " What specific topic would you like to explore together?";
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Topic Management Functions
  const updateTopicProgress = (topicId, newProgress) => {
    setDsaTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        const oldProgress = topic.progress;
        const newStatus = newProgress === 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'not-started';
        
        // Celebration for completion
        if (oldProgress < 100 && newProgress === 100) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
          setStudyStreak(prev => prev + 1);
        }
        
        return { 
          ...topic, 
          progress: newProgress,
          status: newStatus,
          lastStudied: new Date().toISOString().split('T')[0]
        };
      }
      return topic;
    }));
  };

  const addConcept = (topicId) => {
    if (newConcept.trim()) {
      setDsaTopics(prev => prev.map(topic =>
        topic.id === topicId
          ? { ...topic, concepts: [...topic.concepts, newConcept.trim()] }
          : topic
      ));
      setNewConcept('');
      setShowConceptModal(false);
    }
  };

  const addExample = (topicId) => {
    if (newExample.trim()) {
      setDsaTopics(prev => prev.map(topic =>
        topic.id === topicId
          ? { ...topic, examples: [...topic.examples, newExample.trim()] }
          : topic
      ));
      setNewExample('');
    }
  };

  const deleteTopic = (topicId) => {
    if (window.confirm('Are you sure you want to delete this topic?')) {
      setDsaTopics(prev => prev.filter(topic => topic.id !== topicId));
    }
  };

  const saveNewTopic = () => {
    if (topicForm.name.trim()) {
      const newTopic = {
        id: Date.now(),
        ...topicForm,
        status: 'not-started',
        progress: 0,
        concepts: [],
        examples: [],
        timeSpent: 0,
        lastStudied: null
      };
      setDsaTopics(prev => [...prev, newTopic]);
      setTopicForm({ name: '', category: 'Basic', difficulty: 'Easy', notes: '' });
      setShowTopicModal(false);
    }
  };

  const removeConcept = (topicId, conceptIndex) => {
    setDsaTopics(prev => prev.map(topic =>
      topic.id === topicId
        ? { ...topic, concepts: topic.concepts.filter((_, idx) => idx !== conceptIndex) }
        : topic
    ));
  };

  // Calculations
  const totalProgress = Math.round(dsaTopics.reduce((sum, topic) => sum + topic.progress, 0) / dsaTopics.length);
  const completedTopics = dsaTopics.filter(topic => topic.status === 'completed').length;
  const inProgressTopics = dsaTopics.filter(topic => topic.status === 'in-progress').length;
  const totalConcepts = dsaTopics.reduce((sum, topic) => sum + topic.concepts.length, 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={16} className="text-success" />;
      case 'in-progress': return <Clock size={16} className="text-warning" />;
      default: return <Circle size={16} className="text-secondary" />;
    }
  };

  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .celebrate {
          animation: celebrate 0.5s ease-in-out;
        }
        
        .hover-scale:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }
        
        .progress-glow {
          box-shadow: 0 0 20px rgba(13, 110, 253, 0.3);
        }
        
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        
        .neon-border {
          border: 2px solid;
          border-image: linear-gradient(45deg, #667eea, #764ba2) 1;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes celebrate {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .topic-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .topic-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        
        .voice-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .voice-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .chat-bubble {
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .nav-link.active {
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px;
          color: white !important;
        }
        
        .custom-progress {
          height: 8px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .custom-progress .progress-bar {
          border-radius: 10px;
          background: linear-gradient(90deg, #28a745, #20c997);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{background: 'rgba(0,0,0,0.8)', zIndex: 9999}}>
          <div className="text-center text-white celebrate">
            <Trophy size={80} className="text-warning mb-3" />
            <h2 className="mb-2">🎉 Topic Completed! 🎉</h2>
            <p className="lead">Amazing work! Keep that streak going!</p>
          </div>
        </div>
      )}

      {/* Enhanced Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-lg" style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'}}>
        <div className="container">
          <a className="navbar-brand fw-bold d-flex align-items-center" href="#" onClick={() => setActiveTab('dashboard')}>
            <div className="me-2 p-2 rounded-circle" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
              <Brain size={24} className="text-white" />
            </div>
            DSA Master Hub
          </a>
          <div className="navbar-nav ms-auto d-flex flex-row">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: Target },
              { key: 'topics', label: 'Topics', icon: BookOpen },
              { key: 'progress', label: 'Progress', icon: BarChart3 },
              { key: 'assistant', label: 'AI Tutor', icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <button 
                key={key}
                className={`nav-link btn btn-link text-light mx-1 px-3 py-2 ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
                style={{borderRadius: '8px', transition: 'all 0.3s ease'}}
              >
                <Icon size={16} className="me-1" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Enhanced Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Hero Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="glass-card border-0 rounded-4 p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h1 className="gradient-text mb-2 fw-bold">Welcome Back, DSA Champion! 🚀</h1>
                      <p className="text-muted mb-3 fs-5">Ready to conquer more algorithms today?</p>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-primary px-3 py-2">
                          <Flame size={16} className="me-1" />
                          {studyStreak} Day Streak
                        </span>
                        <span className="badge bg-success px-3 py-2">
                          <Clock size={16} className="me-1" />
                          {totalTimeSpent}h Total Study Time
                        </span>
                        <span className="badge bg-info px-3 py-2">
                          <Brain size={16} className="me-1" />
                          {totalConcepts} Concepts Learned
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="floating">
                        <div className="position-relative mx-auto" style={{width: '120px', height: '120px'}}>
                          <svg width="120" height="120" className="position-absolute">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#e9ecef" strokeWidth="10" />
                            <circle
                              cx="60" cy="60" r="50" fill="none" 
                              stroke="url(#gradient)" strokeWidth="10"
                              strokeDasharray={`${totalProgress * 3.14} 314`}
                              strokeLinecap="round" transform="rotate(-90 60 60)"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#667eea" />
                                <stop offset="100%" stopColor="#764ba2" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="position-absolute top-50 start-50 translate-middle text-center">
                            <h3 className="mb-0 gradient-text fw-bold">{totalProgress}%</h3>
                            <small className="text-muted">Complete</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="row g-4 mb-4">
              {[
                { title: 'Completed Topics', value: completedTopics, icon: Trophy, gradient: 'linear-gradient(135deg, #28a745, #20c997)', bgClass: 'success' },
                { title: 'In Progress', value: inProgressTopics, icon: Clock, gradient: 'linear-gradient(135deg, #ffc107, #fd7e14)', bgClass: 'warning' },
                { title: 'Study Streak', value: `${studyStreak} days`, icon: Flame, gradient: 'linear-gradient(135deg, #dc3545, #e83e8c)', bgClass: 'danger' },
                { title: 'Total Topics', value: dsaTopics.length, icon: BookOpen, gradient: 'linear-gradient(135deg, #007bff, #6610f2)', bgClass: 'primary' }
              ].map((stat, idx) => (
                <div key={idx} className="col-md-6 col-lg-3">
                  <div className="card border-0 rounded-4 h-100 hover-scale" style={{background: stat.gradient}}>
                    <div className="card-body text-white d-flex align-items-center p-4">
                      <div className="me-3">
                        <div className="p-3 rounded-circle bg-white bg-opacity-20">
                          <stat.icon size={32} />
                        </div>
                      </div>
                      <div>
                        <h3 className="card-title mb-1 fw-bold">{stat.value}</h3>
                        <p className="card-text mb-0 opacity-75">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="glass-card border-0 rounded-4 p-4">
                  <h5 className="mb-3 d-flex align-items-center">
                    <Lightbulb size={20} className="me-2 text-warning" />
                    Quick Actions
                  </h5>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary d-flex align-items-center justify-content-start" onClick={() => setActiveTab('topics')}>
                      <Plus size={16} className="me-2" />
                      Add New Topic
                    </button>
                    <button className="btn btn-success d-flex align-items-center justify-content-start" onClick={() => setActiveTab('assistant')}>
                      <MessageSquare size={16} className="me-2" />
                      Ask AI Tutor
                    </button>
                    <button className="btn btn-info d-flex align-items-center justify-content-start" onClick={() => setActiveTab('progress')}>
                      <BarChart3 size={16} className="me-2" />
                      View Detailed Progress
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="glass-card border-0 rounded-4 p-4">
                  <h5 className="mb-3 d-flex align-items-center">
                    <Star size={20} className="me-2 text-warning" />
                    Today's Recommendations
                  </h5>
                  {dsaTopics
                    .filter(t => t.status === 'in-progress')
                    .slice(0, 3)
                    .map(topic => (
                      <div key={topic.id} className="d-flex align-items-center mb-2">
                        <div className="me-2">
                          <div className="custom-progress" style={{width: '60px', height: '6px'}}>
                            <div className="progress-bar" style={{width: `${topic.progress}%`}}></div>
                          </div>
                        </div>
                        <span className="small">{topic.name} ({topic.progress}%)</span>
                      </div>
                    ))}
                  {inProgressTopics === 0 && (
                    <p className="text-muted small">Start a new topic to see recommendations!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row">
              <div className="col-12">
                <div className="glass-card border-0 rounded-4 p-4">
                  <h5 className="mb-4 d-flex align-items-center">
                    <TrendingUp size={20} className="me-2 text-primary" />
                    Recent Topics & Progress
                  </h5>
                  <div className="row g-3">
                    {dsaTopics
                      .sort((a, b) => new Date(b.lastStudied || 0) - new Date(a.lastStudied || 0))
                      .slice(0, 6)
                      .map(topic => (
                        <div key={topic.id} className="col-md-6 col-lg-4">
                          <div className="card border rounded-3 h-100 topic-card">
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title mb-0">{topic.name}</h6>
                                {getStatusIcon(topic.status)}
                              </div>
                              <div className="custom-progress mb-2">
                                <div 
                                  className="progress-bar"
                                  style={{width: `${topic.progress}%`}}
                                />
                              </div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted">{topic.progress}% complete</small>
                                <span className={`badge bg-${getDifficultyColor(topic.difficulty)} bg-opacity-25 text-${getDifficultyColor(topic.difficulty)}`}>
                                  {topic.difficulty}
                                </span>
                              </div>
                              {topic.lastStudied && (
                                <small className="text-muted">
                                  <Calendar size={12} className="me-1" />
                                  {new Date(topic.lastStudied).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Topics Manager */}
        {activeTab === 'topics' && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-white fw-bold">
                <Code size={28} className="me-2" />
                DSA Topics Manager
              </h2>
              <button className="btn btn-light rounded-pill px-4" onClick={() => setShowTopicModal(true)}>
                <Plus size={20} className="me-1" />
                Add New Topic
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4">
              <div className="glass-card border-0 rounded-4 p-2">
                <div className="btn-group w-100" role="group">
                  {['All', 'Basic', 'Intermediate', 'Advanced'].map(category => (
                    <input 
                      key={category}
                      type="radio" 
                      className="btn-check" 
                      name="categoryFilter" 
                      id={`filter-${category}`}
                      defaultChecked={category === 'All'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="row g-4">
              {dsaTopics.map(topic => (
                <div key={topic.id} className="col-md-6 col-lg-4">
                  <div className="glass-card border-0 rounded-4 h-100 topic-card">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="card-title mb-1 fw-bold">{topic.name}</h5>
                          <div className="d-flex gap-2 mb-2">
                            <span className={`badge bg-${topic.category === 'Basic' ? 'success' : topic.category === 'Intermediate' ? 'warning' : 'danger'} bg-opacity-25`}>
                              {topic.category}
                            </span>
                            <span className={`badge bg-${getDifficultyColor(topic.difficulty)} bg-opacity-25`}>
                              {topic.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="dropdown">
                          <button className="btn btn-link text-muted p-0" data-bs-toggle="dropdown">
                            <Edit size={16} />
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => setEditingTopic(topic)}>Edit</a></li>
                            <li><a className="dropdown-item text-danger" href="#" onClick={() => deleteTopic(topic.id)}>Delete</a></li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="small fw-medium">Progress</span>
                          <span className="small text-muted">{topic.progress}%</span>
                        </div>
                        <div className="custom-progress mb-2">
                          <div 
                            className={`progress-bar ${topic.progress === 100 ? 'progress-glow' : ''}`}
                            style={{width: `${topic.progress}%`}}
                          />
                        </div>
                        <input 
                          type="range" 
                          className="form-range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={topic.progress}
                          onChange={(e) => updateTopicProgress(topic.id, parseInt(e.target.value))}
                        />
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="text-muted mb-0 small fw-bold">CONCEPTS ({topic.concepts.length})</h6>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedTopicId(topic.id);
                              setShowConceptModal(true);
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {topic.concepts.map((concept, idx) => (
                            <span 
                              key={idx} 
                              className="badge bg-primary bg-opacity-25 text-primary position-relative pe-4"
                              style={{cursor: 'pointer'}}
                            >
                              {concept}
                              <button 
                                className="btn-close btn-close-sm position-absolute top-0 end-0 mt-1 me-1"
                                style={{fontSize: '8px'}}
                                onClick={() => removeConcept(topic.id, idx)}
                              ></button>
                            </span>
                          ))}
                          {topic.concepts.length === 0 && (
                            <small className="text-muted">No concepts added yet</small>
                          )}
                        </div>
                      </div>

                      {topic.examples.length > 0 && (
                        <div className="mb-3">
                          <h6 className="text-muted mb-2 small fw-bold">EXAMPLES</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {topic.examples.map((example, idx) => (
                              <span key={idx} className="badge bg-success bg-opacity-25 text-success">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {topic.notes && (
                        <div className="mb-3">
                          <h6 className="text-muted mb-2 small fw-bold">NOTES</h6>
                          <p className="small text-muted bg-light p-2 rounded">{topic.notes}</p>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          {getStatusIcon(topic.status)}
                          <small className="text-muted">
                            {topic.timeSpent}h studied
                          </small>
                        </div>
                        {topic.lastStudied && (
                          <small className="text-muted">
                            {new Date(topic.lastStudied).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Progress Tracker */}
        {activeTab === 'progress' && (
          <div>
            <h2 className="text-white mb-4 fw-bold">
              <BarChart3 size={28} className="me-2" />
              Detailed Progress Analytics
            </h2>
            
            <div className="row g-4 mb-4">
              <div className="col-md-8">
                <div className="glass-card border-0 rounded-4 p-4">
                  <h5 className="mb-4">Topic Progress Breakdown</h5>
                  <div className="row g-3">
                    {dsaTopics.map(topic => (
                      <div key={topic.id} className="col-12">
                        <div className="d-flex align-items-center mb-2">
                          <div className="me-3" style={{minWidth: '120px'}}>
                            <strong>{topic.name}</strong>
                            <div className="d-flex gap-1 mt-1">
                              <span className={`badge badge-sm bg-${topic.category === 'Basic' ? 'success' : topic.category === 'Intermediate' ? 'warning' : 'danger'}`}>
                                {topic.category}
                              </span>
                              <span className={`badge badge-sm bg-${getDifficultyColor(topic.difficulty)}`}>
                                {topic.difficulty}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1 me-3">
                            <div className="custom-progress">
                              <div 
                                className={`progress-bar ${topic.progress === 100 ? 'progress-glow' : ''}`}
                                style={{width: `${topic.progress}%`}}
                              />
                            </div>
                          </div>
                          <div className="text-end" style={{minWidth: '60px'}}>
                            <strong>{topic.progress}%</strong>
                            <br />
                            <small className="text-muted">{topic.timeSpent}h</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="glass-card border-0 rounded-4 p-4 mb-4">
                  <div className="text-center">
                    <div className="position-relative mx-auto mb-3" style={{width: '140px', height: '140px'}}>
                      <svg width="140" height="140" className="position-absolute">
                        <circle cx="70" cy="70" r="60" fill="none" stroke="#e9ecef" strokeWidth="12" />
                        <circle
                          cx="70" cy="70" r="60" fill="none" 
                          stroke="url(#progressGradient)" strokeWidth="12"
                          strokeDasharray={`${totalProgress * 3.77} 377`}
                          strokeLinecap="round" transform="rotate(-90 70 70)"
                          className={totalProgress === 100 ? 'progress-glow' : ''}
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#28a745" />
                            <stop offset="100%" stopColor="#20c997" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="position-absolute top-50 start-50 translate-middle text-center">
                        <h2 className="mb-0 gradient-text fw-bold">{totalProgress}%</h2>
                        <small className="text-muted">Overall</small>
                      </div>
                    </div>
                    <h5 className="gradient-text">Total Progress</h5>
                    <p className="text-muted mb-0">
                      {completedTopics}/{dsaTopics.length} topics completed
                    </p>
                  </div>
                </div>

                <div className="glass-card border-0 rounded-4 p-4">
                  <h6 className="mb-3">Study Statistics</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Study Streak:</span>
                    <strong className="text-primary">{studyStreak} days</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Study Time:</span>
                    <strong className="text-success">{totalTimeSpent}h</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Concepts Learned:</span>
                    <strong className="text-info">{totalConcepts}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Avg. per Topic:</span>
                    <strong className="text-warning">{Math.round(totalTimeSpent/dsaTopics.length)}h</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Heatmap Placeholder */}
            <div className="row">
              <div className="col-12">
                <div className="glass-card border-0 rounded-4 p-4">
                  <h5 className="mb-3">Study Pattern (Last 30 Days)</h5>
                  <div className="d-flex justify-content-center">
                    <div className="row g-1">
                      {Array.from({length: 30}, (_, i) => (
                        <div key={i} className="col">
                          <div 
                            className="rounded"
                            style={{
                              width: '15px',
                              height: '15px',
                              backgroundColor: Math.random() > 0.3 ? 
                                `rgba(40, 167, 69, ${Math.random()})` : 
                                '#e9ecef'
                            }}
                            title={`Day ${i + 1}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <span className="me-3">Less</span>
                      <span className="badge bg-light me-1"></span>
                      <span className="badge bg-success bg-opacity-25 me-1"></span>
                      <span className="badge bg-success bg-opacity-50 me-1"></span>
                      <span className="badge bg-success me-3"></span>
                      <span>More</span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced AI Assistant */}
        {activeTab === 'assistant' && (
          <div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="glass-card border-0 rounded-4 overflow-hidden">
                  <div className="p-4" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <div className="text-center">
                      <div className="mb-3">
                        <Brain size={48} className="floating" />
                      </div>
                      <h3 className="mb-2 fw-bold">AI DSA Tutor</h3>
                      <p className="mb-0 opacity-75">Your personal mentor for mastering algorithms & data structures</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Voice Interface */}
                    <div className="text-center mb-4">
                      <div className="d-flex justify-content-center gap-3 mb-3">
                        <button 
                          className={`voice-button btn btn-lg rounded-circle text-white ${isListening ? 'pulse-animation' : ''}`}
                          onClick={isListening ? () => setIsListening(false) : startListening}
                          disabled={isSpeaking}
                          style={{width: '80px', height: '80px'}}
                        >
                          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                        </button>
                        
                        {isSpeaking && (
                          <button 
                            className="btn btn-warning btn-lg rounded-circle pulse-animation"
                            onClick={stopSpeaking}
                            style={{width: '80px', height: '80px'}}
                          >
                            <Volume2 size={32} />
                          </button>
                        )}
                      </div>
                      
                      <div className="status-text">
                        {isListening && (
                          <div className="alert alert-primary rounded-pill d-inline-flex align-items-center">
                            <div className="pulse-animation me-2" style={{
                              width: '8px', height: '8px', 
                              backgroundColor: '#0d6efd', 
                              borderRadius: '50%'
                            }}></div>
                            Listening... Speak now!
                          </div>
                        )}
                        {isSpeaking && (
                          <div className="alert alert-warning rounded-pill d-inline-flex align-items-center">
                            <Volume2 size={16} className="me-2" />
                            AI Tutor is speaking...
                          </div>
                        )}
                        {!isListening && !isSpeaking && (
                          <p className="text-muted">Click the microphone to start a conversation with your AI tutor</p>
                        )}
                      </div>
                    </div>

                    {/* Chat History */}
                    {chatHistory.length > 0 && (
                      <div className="mb-4" style={{maxHeight: '400px', overflowY: 'auto'}}>
                        <h6 className="mb-3">Conversation History</h6>
                        {chatHistory.map((chat, idx) => (
                          <div key={idx} className={`chat-bubble mb-3 ${chat.type === 'user' ? 'text-end' : ''}`}>
                            <div className={`d-inline-block p-3 rounded-4 ${
                              chat.type === 'user' 
                                ? 'bg-primary text-white' 
                                : 'bg-light'
                            }`} style={{maxWidth: '70%'}}>
                              <p className="mb-1">{chat.message}</p>
                              <small className={`opacity-75 ${chat.type === 'user' ? 'text-white' : 'text-muted'}`}>
                                {chat.timestamp}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Current Interaction */}
                    {voiceInput && (
                      <div className="alert alert-info rounded-4 mb-4">
                        <div className="d-flex align-items-start">
                          <MessageSquare size={20} className="me-2 mt-1 flex-shrink-0" />
                          <div>
                            <h6 className="mb-1">You said:</h6>
                            <p className="mb-0 fst-italic">"{voiceInput}"</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {aiResponse && (
                      <div className="alert alert-success rounded-4 mb-4">
                        <div className="d-flex align-items-start">
                          <Brain size={20} className="me-2 mt-1 flex-shrink-0" />
                          <div className="flex-grow-1">
                            <h6 className="mb-2">AI Tutor Response:</h6>
                            <p className="mb-2">{aiResponse}</p>
                            {!isSpeaking && (
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => speakResponse(aiResponse)}
                              >
                                <Volume2 size={14} className="me-1" />
                                Replay Audio
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Questions */}
                    <div>
                      <h6 className="mb-3">Quick Questions & Topics</h6>
                      <div className="row g-2">
                        {[
                          { q: "How am I doing with my progress?", icon: BarChart3, color: "primary" },
                          { q: "Explain binary search trees", icon: Code, color: "success" },
                          { q: "What should I study next?", icon: Lightbulb, color: "warning" },
                          { q: "Help me with dynamic programming", icon: Brain, color: "info" },
                          { q: "Explain graph algorithms", icon: Target, color: "danger" },
                          { q: "Time complexity tips", icon: Clock, color: "dark" }
                        ].map((item, idx) => (
                          <div key={idx} className="col-md-6 col-lg-4">
                            <button 
                              className={`btn btn-outline-${item.color} btn-sm w-100 text-start d-flex align-items-center`}
                              onClick={() => handleVoiceQuery(item.q)}
                              disabled={isListening || isSpeaking}
                            >
                              <item.icon size={16} className="me-2 flex-shrink-0" />
                              <span className="text-truncate">{item.q}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="mt-4 p-3 bg-light rounded-4">
                      <h6 className="mb-2">💡 Pro Tips for Better Conversations:</h6>
                      <ul className="small text-muted mb-0">
                        <li>Ask specific questions about algorithms or data structures</li>
                        <li>Request explanations of time/space complexity</li>
                        <li>Ask for problem-solving strategies and approaches</li>
                        <li>Get personalized study recommendations based on your progress</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      {showTopicModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Add New DSA Topic</h5>
                <button className="btn-close" onClick={() => setShowTopicModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Topic Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Hash Tables"
                    value={topicForm.name}
                    onChange={(e) => setTopicForm({...topicForm, name: e.target.value})}
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Category</label>
                    <select 
                      className="form-select"
                      value={topicForm.category}
                      onChange={(e) => setTopicForm({...topicForm, category: e.target.value})}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Difficulty</label>
                    <select 
                      className="form-select"
                      value={topicForm.difficulty}
                      onChange={(e) => setTopicForm({...topicForm, difficulty: e.target.value})}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Initial Notes (Optional)</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Add any initial thoughts or learning goals..."
                    value={topicForm.notes}
                    onChange={(e) => setTopicForm({...topicForm, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-secondary" onClick={() => setShowTopicModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveNewTopic}>
                  <Plus size={16} className="me-1" />
                  Add Topic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Concept Modal */}
      {showConceptModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Add New Concept</h5>
                <button className="btn-close" onClick={() => setShowConceptModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Concept Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g., Hash collision resolution"
                    value={newConcept}
                    onChange={(e) => setNewConcept(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addConcept(selectedTopicId)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-secondary" onClick={() => setShowConceptModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => addConcept(selectedTopicId)}>
                  <Plus size={16} className="me-1" />
                  Add Concept
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSALearningPlatform;