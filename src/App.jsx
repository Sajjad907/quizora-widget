import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import QuizRunner from './components/QuizRunner';
import { Database, ShieldCheck, Activity, ChevronRight, Layout } from 'lucide-react';

const QuizPage = () => {
  const { handle } = useParams();
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-12 animate-fade-in">
      <div className="premium-card rounded-3xl overflow-hidden min-h-[500px]">
        <QuizRunner quizId={handle} key={handle} />
      </div>
    </div>
  );
};

const Home = () => {
  const [inputQuizId, setInputQuizId] = useState("");
  const navigate = useNavigate();

  const handleLaunch = () => {
    if (inputQuizId.trim()) {
      navigate(`/quiz/${inputQuizId.trim()}`);
    }
  };

  return (
    <div className="w-full max-w-md px-4 animate-fade-in">
      <div className="premium-card p-8 md:p-10 rounded-3xl flex flex-col items-center space-y-8 relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
           <Database size={32} />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Connect to Registry</h2>
          <p className="text-white/40 text-sm">Enter a Quiz ID or Handle to proceed</p>
        </div>
        
        <div className="w-full space-y-4">
          <input 
            type="text" 
            value={inputQuizId}
            onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
            onChange={(e) => setInputQuizId(e.target.value)}
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-white/20"
            placeholder="e.g. skin-quiz-01"
          />
          <button 
            onClick={handleLaunch}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20"
          >
            Launch Engine
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-6 pt-4 opacity-30 text-[10px] font-bold uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><ShieldCheck size={14}/> Secure</div>
           <div className="flex items-center gap-1.5"><Activity size={14}/> Live</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [themeStyles, setThemeStyles] = useState({
    cssVariables: '',
    fontUrl: '',
    fontFamily: ''
  });

  React.useEffect(() => {
    const handleTheme = (event) => {
       const { cssVariables, fontUrl, fontFamily } = event.detail;
       setThemeStyles({ cssVariables, fontUrl, fontFamily });

       if (fontUrl) {
         let link = document.getElementById('quiz-google-fonts');
         if (!link) {
           link = document.createElement('link');
           link.id = 'quiz-google-fonts';
           link.rel = 'stylesheet';
           document.head.appendChild(link);
         }
         link.href = fontUrl;
       }
    };

    window.addEventListener('quiz-theme-loaded', handleTheme);
    return () => window.removeEventListener('quiz-theme-loaded', handleTheme);
  }, []);

  return (
    <BrowserRouter>
      <style>{`:root { ${themeStyles.cssVariables} }`}</style>
      <div className="min-h-screen flex flex-col items-center transition-colors duration-500" 
           style={{ 
             backgroundColor: 'var(--bg-main, #0a0a0b)', 
             color: 'var(--text-main, #ffffff)',
             fontFamily: 'var(--font-main, Inter)'
           }}>
        {/* Subtle Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
        </div>

        <header className="w-full max-w-6xl px-6 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                 <Layout size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
                Quizora<span className="text-blue-500">.</span>Runner
              </h1>
           </div>
           
           <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hidden md:flex">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> System Active</span>
              <span className="w-px h-4 bg-white/10" />
              <span>v2.4.0 Stable</span>
           </div>
        </header>

        <main className="flex-1 w-full flex flex-col items-center justify-center relative z-10 pb-20">
          <Routes>
            <Route path="/quiz/:handle" element={<QuizPage />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
