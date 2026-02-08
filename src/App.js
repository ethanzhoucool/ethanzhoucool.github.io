import React, { useState, useEffect } from 'react';
import { Users, Eye, Mail, Instagram, Linkedin, BarChart3, Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [easterEgg, setEasterEgg] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const fullText = 'ethan!';

  useEffect(() => {
    setMounted(true);

    // Easter egg for curious devs & recruiters 👀
    console.log(
      '%c👋 hey, you found the console!',
      'font-size: 20px; font-weight: bold; color: #2563eb;'
    );
    console.log(
      '%cif you\'re a recruiter reading this — i like you already.\nlet\'s talk → info@ethanzhou.ca',
      'font-size: 14px; color: #0d9488;'
    );
    console.log(
      '%c⚡ built with react + tailwind. no templates, no wordpress.',
      'font-size: 12px; color: #64748b;'
    );

    // Secret keyboard easter egg — type "hire" anywhere
    let buffer = '';
    const handleKeyPress = (e) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);
      if (buffer.includes('hire')) {
        setEasterEgg(true);
        buffer = '';
        setTimeout(() => setEasterEgg(false), 3000);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => {
      clearInterval(typingInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
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
    <div className={darkMode ? 'dark' : ''}>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
      {/* 
        Hey recruiter 👋 — yes, I hand-coded this portfolio.
        React + Tailwind CSS. No templates. No page builders.
        If you're reading this, let's grab coffee → info@ethanzhou.ca
      */}

      {/* Easter egg toast — type "hire" on keyboard to trigger */}
      {easterEgg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-blue-200 dark:border-gray-700 animate-bounce">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">🎉 you typed "hire" — i like where this is going! → <span className="text-blue-600 dark:text-blue-400 font-semibold">info@ethanzhou.ca</span></span>
        </div>
      )}

      <header className="max-w-4xl mx-auto px-6 py-8">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-12">
          <button 
            onClick={() => setActiveTab('overview')}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent hover:scale-95 active:scale-90 transition-all duration-200 cursor-pointer hover:opacity-80"
          >
            ethan zhou
          </button>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'about' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm active:scale-95'
              }`}
            >
              about
            </button>
            <button 
              onClick={() => setActiveTab('projects')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'projects' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm active:scale-95'
              }`}
            >
              projects
            </button>
            {/* Experience tab hidden for now
            <button 
              onClick={() => setActiveTab('experience')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                activeTab === 'experience' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm active:scale-95'
              }`}
            >
              experience
            </button>
            */}
            <button 
              onClick={() => setActiveTab('media')} 
              className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm whitespace-nowrap ${
                activeTab === 'media' 
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold shadow-md' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm active:scale-95'
              }`}
            >
              social media
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-1 px-2.5 py-2 rounded-lg transition-all duration-300 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 active:scale-95"
              title={darkMode ? 'Switch to Serious mode' : 'Switch to Unreasonably Serious mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        {activeTab === 'overview' && (
          <div className={`transition-all duration-700 min-h-0 md:min-h-[calc(100vh-200px)] flex flex-col justify-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Photo */}
            <div className="mb-6 sm:mb-8 md:mb-12 flex justify-center">
              <div 
                className="w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full shadow-lg border-4 border-white dark:border-gray-800 hover:scale-105 transition-transform duration-500 overflow-hidden"
                data-secret="you found me! hire this guy → info@ethanzhou.ca"
                title="👋"
              >
                <img src="/images/headshot.jpg" alt="Ethan Zhou" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6">
                <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
                  hey there, i'm 
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-2 md:mb-3 px-4">
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="text-base sm:text-lg md:text-xl">engineering & business @ western university</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mb-6 md:mb-10 px-4">
                <Sparkles className="w-4 h-4 text-teal-500 dark:text-teal-400 flex-shrink-0" />
                <span className="text-base sm:text-lg md:text-xl">content creator x growth strategist</span>
              </div>

              {/* Connect Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 mb-12 px-4">
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
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-blue-200 dark:border-gray-700"
                >
                  <Instagram className="w-4 h-4" />
                  @ethanzhouwealth
                </a>
                <a 
                  href="https://www.linkedin.com/in/ethan-zhou-832565315/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-teal-200 dark:border-gray-700"
                >
                  <Linkedin className="w-4 h-4" />
                  linkedin
                </a>
              </div>
            </div>
          </div>
        )}

        {/* About */}
        {activeTab === 'about' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> about me
            </h1>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-800">
              <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                <p>
                  i'm pursuing a <span className="font-semibold text-blue-600 dark:text-blue-400">bachelor of engineering with honours business administration</span> at western university. 
                  i was awarded the <span className="font-semibold text-teal-600 dark:text-teal-400">western scholarship of excellence</span> and accepted into <span className="font-semibold text-teal-600 dark:text-teal-400">ivey's advanced entry opportunity (aeo)</span> for the hba dual degree.
                </p>
                <p>
                  i've worked on improving website performance, growing social media audiences, and building educational content that has reached <span className="font-bold text-blue-600 dark:text-blue-400">millions of viewers</span> across platforms.
                </p>
                <p>
                  i'm especially passionate about growth strategy, digital marketing, and building scalable online systems that make an impact.
                </p>
              </div>
            </div>

            {/* Hobbies */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-blue-500 dark:text-blue-400">✦</span> hobbies
              </h2>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                {/* Jiu Jitsu */}
                <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
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
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">jiu jitsu</h3>
                  </div>
                </div>

                {/* Badminton */}
                <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/badminton.jpg" alt="Badminton" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">badminton</h3>
                  </div>
                </div>

                {/* Hockey */}
                <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/hockey.jpg" alt="Hockey" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">hockey</h3>
                  </div>
                </div>

                {/* Investing */}
                <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/investing.jpg" alt="Investing" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">investing</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 sm:p-8 shadow-md border border-blue-100 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <span className="text-blue-500 dark:text-blue-400">✦</span> quick facts
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
                  <span>I speak 2.5 languages (english chinese, and learning french)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-500 dark:text-teal-400 text-xl">→</span>
                  <span>my favourite dish is eggs and tomatoes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
                  <span>I enjoy snowboarding in the Rockies (love sunshine)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">→</span>
                  <span>1400 rapid chess - <a href="https://www.chess.com/member/xxhyperinsanexx" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline">challenge me!</a></span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Projects */}
        {activeTab === 'projects' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> projects
            </h1>

            {/* Explain My Code */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300 max-w-2xl mx-auto">
              <a 
                href="https://explain-my-code-w3sj.onrender.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
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
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Explain my Code</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
                  can explain a code to a 5 year old
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">AI</span>
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs rounded-full font-medium">Education</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">Web App</span>
                </div>
                <a 
                  href="https://explain-my-code-w3sj.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  visit project
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Experience (hidden from nav but preserved) */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> my experience
            </h1>
            {experience.map((exp, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{exp.role}</h3>
                    <div className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold">{exp.company}</div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{exp.location} • {exp.period}</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-xl border-2 border-teal-200 dark:border-teal-800 w-fit">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">{exp.impact}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{exp.metric}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'media' && (
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-gray-100">
              <span className="text-teal-500 dark:text-teal-400">✦</span> social media
            </h1>

            <div className="bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800 mb-6 sm:mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img src="/images/featured.jpg" alt="Featured Content" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">@ethanzhouwealth</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
                  creating educational content about investing and personal finance.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-teal-200 dark:border-teal-800">
                    <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm">3M+ total views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-blue-200 dark:border-blue-800">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">9K+ across tiktok/insta/yt</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700">
                    <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm">150+ videos</span>
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

            {/* Brands */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-teal-500 dark:text-teal-400">✦</span> brands i've worked with
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
              
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                interested in partnering? <a href="mailto:info@ethanzhou.ca" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">let's chat!</a>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 md:mt-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="mailto:info@ethanzhou.ca" className="text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ethan-zhou-832565315/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-600" title="hand-coded with ❤️ and way too much coffee">© 2026 ethan zhou</div>
        </footer>
      </header>
    </div>
    </div>
  );
};

export default Portfolio;