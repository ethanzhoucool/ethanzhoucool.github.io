import React, { useState, useEffect } from 'react';
import { Users, Eye, Mail, Instagram, Linkedin, BarChart3, Sparkles, ArrowRight } from 'lucide-react';

const BrokerPortfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'ethan!';

  useEffect(() => {
    setMounted(true);
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50">
      {/* Simple Header */}
      <header className="max-w-4xl mx-auto px-6 py-8">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-12">
          <button 
            onClick={() => setActiveTab('overview')}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent hover:scale-95 active:scale-90 transition-all duration-200 cursor-pointer hover:opacity-80"
          >
            ethan zhou
          </button>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'about' 
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm active:scale-95'
              }`}
            >
              about
            </button>
            <button 
              onClick={() => setActiveTab('projects')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'projects' 
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm active:scale-95'
              }`}
            >
              projects
            </button>
            {/* Experience tab hidden for now
            <button 
              onClick={() => setActiveTab('experience')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'experience' 
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm active:scale-95'
              }`}
            >
              experience
            </button>
            */}
            <button 
              onClick={() => setActiveTab('media')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm whitespace-nowrap ${
                activeTab === 'media' 
                  ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm active:scale-95'
              }`}
            >
              social media
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        {activeTab === 'overview' && (
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Photo Placeholder */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition-transform duration-500 overflow-hidden">
                <img src="/images/headshot.jpg" alt="Ethan Zhou" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  hey there, i'm 
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-700 mb-2 px-4">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-base sm:text-lg">engineering & business @ western university</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700 mb-6 px-4">
                <Sparkles className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span className="text-base sm:text-lg">content creator x growth strategist</span>
              </div>

              {/* Connect Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-12 px-4">
                <a 
                  href="mailto:info@ethanzhou.ca"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                  let's connect!
                </a>
                <a 
                  href="https://instagram.com/ethanzhouwealth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-blue-200"
                >
                  <Instagram className="w-4 h-4" />
                  @ethanzhouwealth
                </a>
                <a 
                  href="https://www.linkedin.com/in/ethan-zhou-832565315/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-teal-200"
                >
                  <Linkedin className="w-4 h-4" />
                  linkedin
                </a>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
              <span className="text-blue-500">✦</span> about me
            </h1>

            {/* About Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-100">
              <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                <p>
                  i'm pursuing a <span className="font-semibold text-blue-600">bachelor of engineering with honours business administration</span> at western university. 
                  i was awarded the <span className="font-semibold text-teal-600">western scholarship of excellence</span> and accepted into <span className="font-semibold text-teal-600">ivey's advanced entry opportunity (aeo)</span> for the hba dual degree.
                </p>
                <p>
                  i've worked on improving website performance, growing social media audiences, and building educational content that has reached <span className="font-bold text-blue-600">millions of viewers</span> across platforms.
                </p>
                <p>
                  i'm especially passionate about growth strategy, digital marketing, and building scalable online systems that make an impact.
                </p>
              </div>
            </div>

            {/* Hobbies Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-blue-500">✦</span> hobbies
              </h2>
              
              {/* Hobbies Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                {/* Jiu Jitsu - Video */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-200 hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                  <div className="aspect-square relative overflow-hidden">
                    <video 
                      src="/images/jiujitsu.mp4" 
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">jiu jitsu</h3>
                  </div>
                </div>

                {/* Badminton */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-teal-200 hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/badminton.jpg" alt="Badminton" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">badminton</h3>
                  </div>
                </div>

                {/* Hockey */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/hockey.jpg" alt="Hockey" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">hockey</h3>
                  </div>
                </div>

                {/* Investing */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-teal-200 hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/investing.jpg" alt="Investing" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800">investing</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">✦</span> quick facts
              </h2>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">→</span>
                  <span>I speak 2.5 languages (english chinese, and learning french)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 text-xl">→</span>
                  <span>my favourite dish is eggs and tomatoes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 text-xl">→</span>
                  <span>I enjoy snowboarding in the Rockies (love sunshine)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 text-xl">→</span>
                  <span>1400 rapid chess - <a href="https://www.chess.com/member/xxhyperinsanexx" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline">challenge me!</a></span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
              <span className="text-blue-500">✦</span> projects
            </h1>

            {/* Explain My Code Project */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 max-w-2xl mx-auto">
              <a 
                href="https://explain-my-code-w3sj.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 overflow-hidden">
                  <video 
                    src="/images/explain-my-code.mp4" 
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </a>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Explain my Code</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  can explain a code to a 5 year old
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">AI</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-600 text-xs rounded-full font-medium">Education</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full font-medium">Web App</span>
                </div>
                <a 
                  href="https://explain-my-code-w3sj.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  visit project
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
              <span className="text-blue-500">✦</span> my experience
            </h1>
            {experience.map((exp, index) => (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-300"
              >
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{exp.role}</h3>
                    <div className="text-base sm:text-lg text-blue-600 font-semibold">{exp.company}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{exp.location} • {exp.period}</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 px-4 py-2 rounded-xl border-2 border-teal-200 w-fit">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600">{exp.impact}</div>
                    <div className="text-xs text-gray-600">{exp.metric}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                      <ArrowRight className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === 'media' && (
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800">
              <span className="text-teal-500">✦</span> social media
            </h1>

            {/* Featured Content */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-100 mb-6 sm:mb-8 hover:shadow-2xl transition-all duration-300">
              <div className="aspect-video overflow-hidden">
                <img src="/images/featured.jpg" alt="Featured Content" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">@ethanzhouwealth</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  creating educational content about investing and personal finance.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-teal-50 px-3 sm:px-4 py-2 rounded-full border-2 border-teal-200">
                    <Eye className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-teal-600 font-semibold text-xs sm:text-sm">3M+ total views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-full border-2 border-blue-200">
                    <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-blue-600 font-semibold text-xs sm:text-sm">9K+ across tiktok/insta/yt</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 px-3 sm:px-4 py-2 rounded-full border-2 border-slate-200">
                    <BarChart3 className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span className="text-slate-600 font-semibold text-xs sm:text-sm">150+ videos</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://instagram.com/ethanzhouwealth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                    follow on instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Brands Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-teal-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-teal-500">✦</span> brands i've worked with
              </h2>
              
              {/* Brand Logos Grid */}
              <div className="flex justify-center items-center gap-6 flex-wrap">
                {/* Turbo Logo */}
                <a 
                  href="https://turbo.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-2xl overflow-hidden w-32 h-32 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <img src="/images/turbo-logo.png" alt="Turbo" className="w-full h-full object-cover" />
                </a>
                
                {/* Add more brands here in the future - just duplicate the div above */}
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                interested in partnering? <a href="mailto:info@ethanzhou.ca" className="text-blue-600 hover:text-blue-700 font-semibold">let's chat!</a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="mailto:info@ethanzhou.ca" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ethan-zhou-832565315/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-gray-500">© 2026 ethan zhou</div>
        </footer>
      </header>
    </div>
  );
};

export default BrokerPortfolio;