import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Eye, Mail, Instagram, Linkedin, Youtube, BarChart3, ArrowRight, Sun, Moon } from 'lucide-react';

/* ─── Custom cursor component ─── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      visible.current = true;
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    const checkHover = () => {
      const el = document.elementFromPoint(pos.current.x, pos.current.y);
      hovering.current = el && (el.closest('a') || el.closest('button') || el.closest('[data-hover]'));
    };

    let raf;
    const animate = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
        cursorRef.current.style.opacity = visible.current ? 1 : 0;

        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
        ringRef.current.style.opacity = visible.current ? 1 : 0;

        checkHover();
        cursorRef.current.className = `custom-cursor${hovering.current ? ' hovering' : ''}`;
        ringRef.current.className = `cursor-ring${hovering.current ? ' hovering' : ''}`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* ─── Magnetic button component ─── */
const MagneticButton = ({ children, className = '', ...props }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={btnRef}
      className="magnetic-btn inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {React.cloneElement(children, { className: `${children.props.className || ''} ${className}` , ...props })}
    </div>
  );
};

/* ─── Proximity text — letters react to cursor ─── */
const ProximityText = ({ text, className = '' }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const rafId = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const strength = 1 - dist / maxDist;
          const scale = 1 + strength * 0.2;
          const moveX = (dx / dist) * strength * 4;
          const moveY = (dy / dist) * strength * 4;
          el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        } else {
          el.style.transform = 'translate(0, 0) scale(1)';
        }
      });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const letters = text.split('');

  return (
    <span ref={containerRef} className={className}>
      {letters.map((char, i) => (
        <span
          key={i}
          ref={(el) => (lettersRef.current[i] = el)}
          className="proximity-letter"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

/* ─── Flip card photo component ─── */
const FlipPhoto = () => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      inner.style.transform = `rotateY(180deg) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(10px)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner');
    if (inner) inner.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className="flip-card w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 float-animation"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hover
    >
      <div className="flip-card-inner shadow-xl rounded-full border-4 border-white">
        <div className="flip-card-front">
          <img src="/images/seriousheadshot.JPG" alt="Ethan Zhou" className="w-full h-full object-cover" />
        </div>
        <div className="flip-card-back">
          <img src="/images/headshot.jpg" alt="Ethan Zhou casual" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN PORTFOLIO COMPONENT
   ════════════════════════════════════════ */
const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  /* Track mouse for gradient background */
  const handleGlobalMouse = useCallback((e) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('mousemove', handleGlobalMouse);

    // Easter egg console messages
    console.log('%c👋 hi, you found the console!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cif you\'re a recruiter reading this let\'s talk → info@ethanzhou.ca', 'font-size: 14px; color: #0d9488;');

    // Type "hire" easter egg
    let buffer = '';
    const handleKeyPress = (e) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);
      if (buffer.includes('hire')) {
        setEasterEgg(true);
        buffer = '';
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouse);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleGlobalMouse]);

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
      impact: '5M+',
      metric: 'Total Views',
      highlights: [
        'Created 150+ educational finance videos',
        'Generated 5M+ views across platforms',
        'Built audience of 20,000+ followers',
        'Focus on investing & personal finance'
      ]
    }
  ];

  /* Interactive gradient — the ONLY gradient on the page */
  const gradientStyle = {
    background: `radial-gradient(
      ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
      ${darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(219, 234, 254, 0.6)'},
      ${darkMode ? 'rgba(15, 23, 42, 0)' : 'rgba(248, 250, 252, 0)'}
    )`,
    transition: 'background 0.3s ease',
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
    <div className={`min-h-screen font-inter ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-500`}>

      {/* Mouse-following gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={gradientStyle} />

      <CustomCursor />

      {/* 
        Hey recruiter 👋 — yes, I hand-coded this portfolio.
        React + Tailwind CSS. No templates. No page builders.
        If you're reading this, let's grab coffee → info@ethanzhou.ca
      */}

      {/* Easter egg toast */}
      {easterEgg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-gray-700 animate-bounce">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">🎉 you typed "hire" — i like where this is going! → <span className="text-blue-600 dark:text-blue-400 font-semibold">info@ethanzhou.ca</span></span>
        </div>
      )}

      <div className="relative z-10">
      <header className="max-w-4xl mx-auto px-6 py-8">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-12">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-95 active:scale-90 transition-all duration-200"
          >
            ethan zhou
          </button>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {['about', 'projects', 'social media'].map((tab) => {
              const key = tab === 'social media' ? 'media' : tab;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                    activeTab === key
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95'
                  }`}
                >
                  {tab}
                </button>
              );
            })}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-1 px-2.5 py-2 rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* ═══ HERO / OVERVIEW — redesigned ═══ */}
        {activeTab === 'overview' && (
          <div className={`transition-all duration-700 min-h-0 md:min-h-[calc(100vh-200px)] flex flex-col justify-center items-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

            {/* Flip Photo */}
            <div className="mb-8 sm:mb-10 md:mb-14 stagger-item" style={{ animationDelay: '0.1s' }}>
              <FlipPhoto />
            </div>

            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              {/* Main heading — handwritten font, solid color, proximity effect */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-caveat font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 stagger-item" style={{ animationDelay: '0.3s' }}>
                <ProximityText text="hey there, i'm ethan!" />
              </h1>

              {/* Subtitle — clean, minimal */}
              <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 md:mb-14 stagger-item" style={{ animationDelay: '0.5s' }}>
                eng student who makes things on the internet
              </p>

              {/* CTA Buttons — solid colors, no gradients, magnetic */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4 stagger-item" style={{ animationDelay: '0.7s' }}>
                <MagneticButton>
                  <a
                    href="mailto:info@ethanzhou.ca"
                    className="flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    data-hover
                  >
                    <Mail className="w-4 h-4" />
                    let's connect!
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://instagram.com/ethanzhouwealth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                    data-hover
                  >
                    <Instagram className="w-4 h-4" />
                    @ethanzhouwealth
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://www.linkedin.com/in/ethan-zhou-832565315/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                    data-hover
                  >
                    <Linkedin className="w-4 h-4" />
                    linkedin
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ABOUT — preserved ═══ */}
        {activeTab === 'about' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> about me
            </h1>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
              <div className="space-y-3 sm:space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
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
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-blue-500 dark:text-blue-400">✦</span> hobbies
              </h2>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-5">
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <video src="/images/jiujitsu.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">jiu jitsu</h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/badminton.jpg" alt="Badminton" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">badminton</h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/hockey.jpg" alt="Hockey" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">hockey</h3>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <img src="/images/investing.jpg" alt="Investing" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 sm:p-4 text-center">
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">investing</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span className="text-blue-500 dark:text-blue-400">✦</span> quick facts
              </h2>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
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
                  <span>1400 rapid chess - <a href="https://www.chess.com/member/xxhyperinsanexx" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline" data-hover>challenge me!</a></span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ═══ PROJECTS — preserved ═══ */}
        {activeTab === 'projects' && (
          <div className={`space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> projects
            </h1>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 max-w-2xl mx-auto">
              <a href="https://explain-my-code-w3sj.onrender.com/" target="_blank" rel="noopener noreferrer" className="block" data-hover>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <video src="/images/explain-my-code.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                </div>
              </a>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Explain my Code</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
                  can explain a code to a 5 year old
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">AI</span>
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs rounded-full font-medium">Education</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">Web App</span>
                </div>
                <a href="https://explain-my-code-w3sj.onrender.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors" data-hover>
                  visit project
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EXPERIENCE (hidden tab, preserved) ═══ */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> my experience
            </h1>
            {experience.map((exp, index) => (
              <div key={index} className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{exp.role}</h3>
                    <div className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold">{exp.company}</div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{exp.location} • {exp.period}</div>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-xl border-2 border-teal-200 dark:border-teal-800 w-fit">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">{exp.impact}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{exp.metric}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ═══ SOCIAL MEDIA — preserved ═══ */}
        {activeTab === 'media' && (
          <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-teal-500 dark:text-teal-400">✦</span> social media
            </h1>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 mb-6 sm:mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img src="/images/featured.jpg" alt="Featured Content" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">@ethanzhouwealth</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4">
                  creating educational content about investing and personal finance.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-teal-200 dark:border-teal-800">
                    <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm">5M+ total views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-blue-200 dark:border-blue-800">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">20K+ across tiktok/insta/yt</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700">
                    <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm">150+ videos</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" data-hover>
                    <Instagram className="w-4 h-4" />
                    follow on instagram
                  </a>
                  <a href="https://www.youtube.com/@Ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" data-hover>
                    <Youtube className="w-4 h-4" />
                    subscribe on youtube
                  </a>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-teal-500 dark:text-teal-400">✦</span> brands i've worked with
              </h2>
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <a href="https://turbo.ai" target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden w-32 h-32 hover:scale-105 transition-all duration-300 hover:shadow-lg" data-hover>
                  <img src="/images/turbo-logo.png" alt="Turbo" className="w-full h-full object-cover" />
                </a>
              </div>
              <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                interested in partnering? <a href="mailto:info@ethanzhou.ca" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold" data-hover>let's chat!</a>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer className="mt-8 md:mt-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="mailto:info@ethanzhou.ca" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@Ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ethan-zhou-832565315/" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-slate-400 dark:text-slate-600">© 2026 ethan zhou</div>
        </footer>
      </header>
      </div>
    </div>
    </div>
  );
};

export default Portfolio;