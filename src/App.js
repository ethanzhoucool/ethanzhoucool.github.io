import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Award, Mail, Phone, Instagram, Linkedin, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BrokerPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Growth data for your content creation
  const growthData = [
    { month: 'Aug', value: 500 },
    { month: 'Oct', value: 1200 },
    { month: 'Dec', value: 2400 },
    { month: 'Feb', value: 4500 },
    { month: 'Apr', value: 6800 },
    { month: 'Jun', value: 9000 }
  ];

  const experience = [
    {
      role: 'Marketing & Business Strategy Intern',
      company: 'United Lifts Technologies',
      period: 'April 2025 – Present',
      location: 'Calgary',
      impact: '+256%',
      metric: 'LinkedIn Growth',
      highlights: [
        'Edited 10+ website pages improving UX and SEO',
        'Improved search rankings by 38%',
        'Increased LinkedIn engagement by 256%',
        'Led marketing strategy initiatives'
      ]
    },
    {
      role: 'Content Creator',
      company: '@ethanzhouwealth',
      period: 'August 2023 – Present',
      location: 'Instagram & TikTok',
      impact: '3M+',
      metric: 'Total Views',
      highlights: [
        'Created 150+ educational finance videos',
        'Generated 3M+ views across platforms',
        'Built audience of 9,000+ followers',
        'Focus on investing & personal finance'
      ]
    }
  ];

  const skills = [
    { name: 'Digital Marketing & Growth', level: 95, color: 'bg-cyan-500' },
    { name: 'SEO Optimization', level: 92, color: 'bg-blue-500' },
    { name: 'Content Creation & Video', level: 90, color: 'bg-green-500' },
    { name: 'Social Media Management', level: 88, color: 'bg-purple-500' },
    { name: 'Data-Driven Strategy', level: 85, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Ethan Zhou</span>
            </div>
            <nav className="flex gap-6">
              <button onClick={() => setActiveTab('overview')} className="text-sm text-slate-400 hover:text-white transition-colors">Overview</button>
              <button onClick={() => setActiveTab('experience')} className="text-sm text-slate-400 hover:text-white transition-colors">Experience</button>
              <button onClick={() => setActiveTab('skills')} className="text-sm text-slate-400 hover:text-white transition-colors">Skills</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Ethan Zhou
                </h1>
                <p className="text-slate-400 text-lg mb-2">Engineering & Business Student</p>
                <p className="text-slate-500 mb-4">Western University | Marketing & Growth Strategy</p>
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-slate-400">Western Scholarship of Excellence</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-cyan-500" />
                    <span className="text-slate-400">Ivey AEO</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a href="mailto:ethan.st.zhou@gmail.com" className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Get in Touch
                  </a>
                  <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    @ethanzhouwealth
                  </a>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-500 mb-1">3M+</div>
                <div className="text-sm text-slate-400">Total Views</div>
                <div className="text-xl font-bold text-cyan-500 mt-2">9K+</div>
                <div className="text-sm text-slate-400">Followers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-slate-800/30 p-1 rounded-xl w-fit">
          {['overview', 'experience', 'skills'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="space-y-3 text-slate-300">
                <p>
                  I'm pursuing a <span className="text-white font-semibold">Bachelor of Engineering with Honours Business Administration</span> at Western University, awarded the <span className="text-cyan-400">Western Scholarship of Excellence</span> and accepted into <span className="text-cyan-400">Ivey's Advanced Entry Opportunity (AEO)</span> for the HBA dual degree.
                </p>
                <p>
                  I've worked on improving website performance, growing social media audiences, and building educational content that has reached millions of viewers across platforms.
                </p>
                <p>
                  I'm especially interested in growth strategy, digital marketing, and building scalable online systems.
                </p>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Audience Growth</h2>
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +1700% since launch
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={growthData}>
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-cyan-500" />
                  <span className="text-slate-400 text-sm">Total Views</span>
                </div>
                <div className="text-3xl font-bold">3M+</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-slate-400 text-sm">Followers</span>
                </div>
                <div className="text-3xl font-bold">9K+</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <span className="text-slate-400 text-sm">Videos Created</span>
                </div>
                <div className="text-3xl font-bold">150+</div>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                    <p className="text-cyan-400 font-medium mb-1">{exp.company}</p>
                    <p className="text-slate-400 text-sm">{exp.location} • {exp.period}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">{exp.impact}</div>
                    <div className="text-xs text-slate-400">{exp.metric}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-cyan-500 mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-slate-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${skill.color} transition-all duration-1000 ease-out`}
                    style={{ width: mounted ? `${skill.level}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/20">
          <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
          <p className="text-slate-400 mb-6">
            Interested in collaborating on marketing, content, or growth projects? Let's chat!
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:ethan.st.zhou@gmail.com" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all">
              <Mail className="w-4 h-4" />
              ethan.st.zhou@gmail.com
            </a>
            <a href="tel:587-891-2184" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all">
              <Phone className="w-4 h-4" />
              587-891-2184
            </a>
            <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all">
              <Instagram className="w-4 h-4" />
              @ethanzhouwealth
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2026 Ethan Zhou</p>
        </footer>
      </div>
    </div>
  );
};

export default BrokerPortfolio;
