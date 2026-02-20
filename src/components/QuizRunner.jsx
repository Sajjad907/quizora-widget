import React, { useState, useEffect } from 'react';
import { getQuiz, submitQuiz, startSession } from '../api/quizApi';
import QuestionStep from './QuestionStep';
import ResultStep from './ResultStep';
import EmailStep from './EmailStep';
import { Sparkles, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { generateThemeStyles } from '../utils/themeUtils';

const QuizRunner = ({ quizId, initialQuiz }) => {
    const [quiz, setQuiz] = useState(initialQuiz || null);
    const [loading, setLoading] = useState(!initialQuiz);
    const [error, setError] = useState(null);

    const [viewState, setViewState] = useState('start');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [customerInfo, setCustomerInfo] = useState(null);
    const [result, setResult] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuiz(quizId);
                setQuiz(data);

                if (data.theme) {
                    const themeStyles = generateThemeStyles(data.theme);
                    window.dispatchEvent(new CustomEvent('quiz-theme-loaded', { detail: themeStyles }));
                }

                setLoading(false);
            } catch (err) {
                setError("Quiz not found or failed to load.");
                setLoading(false);
            }
        };

        if (quizId && !initialQuiz) {
            fetchQuiz();
        } else if (initialQuiz && initialQuiz.theme) {
            const themeStyles = generateThemeStyles(initialQuiz.theme);
            window.dispatchEvent(new CustomEvent('quiz-theme-loaded', { detail: themeStyles }));
        }
    }, [quizId, initialQuiz]);

    const handleStart = async () => {
        setLoading(true);
        try {
            const sessionData = await startSession(quizId);
            if (sessionData?._id) {
                setSessionId(sessionData._id);
            } else if (sessionData?.sessionId) {
                setSessionId(sessionData.sessionId);
            }
            setViewState('quiz');
        } catch (err) {
            console.error("Failed to start session:", err);
            setViewState('quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId, optionId) => {
        if (!questionId || !optionId) return;
        const qIdStr = String(questionId);
        const oIdStr = String(optionId);

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const isMultiple = currentQuestion.type === 'multiple_choice' || currentQuestion.allowMultiple;

        setAnswers(prev => {
            if (isMultiple) {
                const existingAnswers = prev.filter(a => String(a.questionId) === qIdStr);
                const isAlreadySelected = existingAnswers.some(a => String(a.optionId) === oIdStr);
                if (isAlreadySelected) {
                    return prev.filter(a => !(String(a.questionId) === qIdStr && String(a.optionId) === oIdStr));
                } else {
                    return [...prev, { questionId: qIdStr, optionId: oIdStr, value: null }];
                }
            } else {
                const filtered = prev.filter(a => String(a.questionId) !== qIdStr);
                return [...filtered, { questionId: qIdStr, optionId: oIdStr, value: null }];
            }
        });
    };

    const handleInputChange = (questionId, textValue) => {
        const qIdStr = questionId?.toString();
        setAnswers(prev => {
            const filtered = prev.filter(a => String(a.questionId) !== qIdStr);
            return [...filtered, { questionId: qIdStr, optionId: null, value: textValue }];
        });
    };

    const handleNext = async () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            if (quiz.settings?.collectEmail) {
                setViewState('email');
            } else {
                await handleSubmit();
            }
        }
    };

    const handleSubmit = async (info = null) => {
        try {
            setLoading(true);
            const data = await submitQuiz(quizId, answers, sessionId, info || customerInfo);
            setResult(data);
            setViewState('result');
            setLoading(false);
        } catch (err) {
            setError("Failed to process selections.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 space-y-4">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-sm font-medium text-white/40 uppercase tracking-widest">Loading Quiz Engine...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-4">
                <AlertCircle size={40} className="text-rose-500/50" />
                <p className="text-white/60 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="px-5 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    if (!quiz) return null;

    const layoutMode = quiz.theme?.layoutMode || 'classic';
    const isSplitHero = layoutMode === 'split-hero';
    const isMinimalist = layoutMode === 'minimalist';
    const isGlassMorph = layoutMode === 'glass-morph';

    if (viewState === 'start') {
        const startConf = quiz.startScreen || {};

        return (
            <div className="flex flex-col items-center justify-center min-h-full w-full relative overflow-hidden"
                style={{
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-main)'
                }}>

                {/* Dynamic Background Layer */}
                {(layoutMode === 'classic' || isGlassMorph) && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] transition-all duration-1000 ${isGlassMorph ? 'opacity-30' : 'opacity-20'}`}
                            style={{ background: 'var(--primary)', transform: isGlassMorph ? 'translate(10%, 10%)' : 'none' }} />
                        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-all duration-1000 ${isGlassMorph ? 'opacity-20' : 'opacity-10'}`}
                            style={{ background: 'var(--accent)', transform: isGlassMorph ? 'translate(-10%, -10%)' : 'none' }} />
                        {isGlassMorph && (
                            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[150px] animate-pulse" />
                        )}
                    </div>
                )}

                <div className={`relative z-10 w-full animate-quiz-spring flex flex-col items-center ${isSplitHero ? 'min-h-full' : isMinimalist ? 'max-w-xl space-y-8' : isGlassMorph ? 'max-w-5xl space-y-16' : 'max-w-3xl space-y-12'}`}>
                    {/* SPLIT HERO IMAGE */}
                    {isSplitHero && (
                        <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden mb-10">
                            <img
                                src={quiz.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=2000"}
                                alt="Hero"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-transparent" />
                        </div>
                    )}

                    {!isSplitHero && !isMinimalist && (
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border-white/10 shadow-2xl">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--primary)' }}></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--primary)' }}></span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
                                    AI-Engine Active • {quiz.questions?.length || 0} Questions
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className={`space-y-6 text-center px-6 ${isSplitHero ? 'max-w-xl pb-32' : isMinimalist ? 'py-10' : ''}`}>
                        {!isSplitHero && !isMinimalist && (
                            <div className="flex justify-center mb-8">
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    <div className="relative w-24 h-24 bg-gradient-primary rounded-[2.25rem] flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-105">
                                        <Sparkles size={48} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isSplitHero && (
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-80 mb-4">
                                Personal Identity Analysis
                            </p>
                        )}

                        {isMinimalist && (
                            <div className="flex justify-center mb-6">
                                <Sparkles size={32} className="text-primary opacity-80" />
                            </div>
                        )}

                        <h1 className={`${isSplitHero ? 'text-4xl md:text-5xl' : isMinimalist ? 'text-4xl md:text-6xl' : isGlassMorph ? 'text-6xl md:text-8xl' : 'text-5xl md:text-7xl'} font-black tracking-tight leading-[0.95]`} style={{ color: 'var(--text-main)' }}>
                            {startConf.title || quiz.title || 'Find Your Perfect Match'}
                        </h1>

                        <p className={`font-medium mx-auto leading-relaxed opacity-60 ${isSplitHero ? 'text-base mt-6' : isMinimalist ? 'text-xl max-w-lg pt-4' : 'text-xl md:text-2xl pt-2 max-w-xl'}`}>
                            {startConf.description || 'Our advanced AI analyzes your preferences to recommend the ideal products in seconds.'}
                        </p>

                        {!isSplitHero && !isMinimalist && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto pt-8">
                                {[
                                    { text: 'Personalized', icon: '✨' },
                                    { text: 'Instant Results', icon: '⚡' },
                                    { text: 'AI-Backed', icon: '🧠' },
                                    { text: 'No Signup', icon: '🔒' }
                                ].map((b, i) => (
                                    <div key={i} className={`flex flex-col items-center gap-2 p-4 transition-colors ${isGlassMorph ? 'rounded-3xl bg-white/5 border border-white/10' : 'rounded-2xl glass-card border-white/5 hover:bg-white/5'}`}>
                                        <span className="text-xl">{b.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider opacity-50">{b.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CTA Section */}
                        <div className={`space-y-6 ${isSplitHero ? 'pt-10' : isMinimalist ? 'pt-8' : 'pt-12'}`}>
                            <button
                                onClick={handleStart}
                                className={`group relative flex items-center justify-center gap-4 mx-auto overflow-hidden shadow-2xl transition-all ${isSplitHero ? 'w-full py-5 rounded-2xl text-base' : isMinimalist ? 'px-10 py-5 rounded-xl text-lg' : isGlassMorph ? 'px-14 py-7 rounded-[2.5rem] text-2xl font-black bg-white text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'px-12 py-6 rounded-[2rem] text-xl btn-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_60px_rgba(var(--primary-rgb),0.4)]'}`}
                            >
                                <span className="relative z-10">{startConf.buttonText || 'Begin Analysis'}</span>
                                <ChevronRight size={isSplitHero || isMinimalist ? 20 : isGlassMorph ? 32 : 28} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-8 pt-8 opacity-40">
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-black uppercase tracking-widest leading-none">50k+ Matched</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-black uppercase tracking-widest leading-none">2 Min Analysis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (viewState === 'result' && result) {
        return <ResultStep outcome={result.outcome} products={result.products} scores={result.scoreDetails} theme={quiz.theme} />;
    }

    if (viewState === 'email') {
        return (
            <EmailStep
                theme={quiz.theme}
                onNext={(info) => {
                    setCustomerInfo(info);
                    handleSubmit(info);
                }}
            />
        );
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const progress = ((currentQuestionIndex) / quiz.questions.length) * 100;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const activeQId = String(currentQuestion._id || currentQuestion.id);
    const questionAnswers = answers.filter(a => String(a.questionId) === activeQId);
    const isAnswered = questionAnswers.length > 0 || (questionAnswers.some(a => a.value?.trim().length > 0));
    const theme = quiz.theme || {};

    return (
        <div className={`flex flex-col h-full w-full relative overflow-hidden transition-colors duration-700 ${isGlassMorph ? 'bg-slate-900' : ''}`} style={{ backgroundColor: isGlassMorph ? undefined : 'var(--bg-main)', color: 'var(--text-main)', fontFamily: 'var(--font-main)' }}>

            {/* GLASS MORPH BACKGROUND BLOBS */}
            {isGlassMorph && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]" />
                </div>
            )}

            {/* PROGRESS BAR (Classic/Minimalist only) */}
            {!isSplitHero && (
                <div className="px-4 md:px-10 pt-4">
                    <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-primary transition-all duration-700"
                            style={{
                                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                                transitionTimingFunction: 'var(--quiz-animation)'
                            }}
                        />
                    </div>
                </div>
            )}

            <div className={`flex-1 overflow-y-auto z-10 ${isSplitHero ? 'pb-32' : isGlassMorph ? 'px-6 py-16' : 'px-4 md:px-10 py-10 md:py-14'}`}>
                <div className={`${isSplitHero ? 'w-full' : isGlassMorph ? 'max-w-4xl mx-auto space-y-16' : 'max-w-2xl mx-auto space-y-12'}`}>
                    {!isSplitHero && !isMinimalist && (
                        <div className="flex justify-center">
                            <div className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] glass-card"
                                style={{ color: 'var(--text-main)', opacity: 0.4 }}>
                                Step {currentQuestionIndex + 1} of {quiz.questions.length}
                            </div>
                        </div>
                    )}

                    <QuestionStep
                        key={currentQuestionIndex}
                        question={currentQuestion}
                        questionId={activeQId}
                        onSelectOption={handleOptionSelect}
                        onInputChange={handleInputChange}
                        currentAnswers={questionAnswers}
                        theme={theme}
                        layoutMode={layoutMode}
                        currentStep={currentQuestionIndex + 1}
                        totalSteps={quiz.questions.length}
                    />
                </div>
            </div>

            {/* BOTTOM NAVIGATION - CLASSIC */}
            {!isSplitHero && !isGlassMorph && (
                <div className="border-t p-6 md:px-10 flex justify-between items-center gap-4 backdrop-blur-xl" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'rgba(var(--text-main-rgb), 0.1)' }}>
                    <button
                        disabled={currentQuestionIndex === 0}
                        onClick={handlePrev}
                        className="px-6 py-3 glass-card-hover rounded-xl disabled:opacity-0 transition-all font-bold text-sm"
                        style={{ color: 'var(--text-main)', opacity: 0.6, transitionTimingFunction: 'var(--quiz-animation)' }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        className={`px-10 py-4 rounded-xl font-black transition-all flex items-center gap-2 text-base ${isAnswered ? 'btn-primary shadow-2xl' : 'glass-card cursor-not-allowed'}`}
                        style={{
                            ...(!isAnswered ? { color: 'var(--text-main)', opacity: 0.3 } : {}),
                            transitionTimingFunction: 'var(--quiz-animation)'
                        }}
                    >
                        {currentQuestionIndex === quiz.questions.length - 1 ? 'See Results' : 'Next Step'}
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* BOTTOM NAVIGATION - PREMIUM (SPLIT HERO / GLASS) */}
            {(isSplitHero || isGlassMorph) && (
                <div className={`p-6 md:p-8 backdrop-blur-3xl border-t transition-all ${isGlassMorph ? 'bg-white/5 border-white/10 mx-6 mb-6 rounded-[2.5rem]' : 'bg-white/90 border-black/5'}`} style={{ backgroundColor: isGlassMorph ? 'transparent' : 'var(--bg-main)' }}>
                    <div className="max-w-4xl mx-auto flex items-center gap-6">
                        <div className="flex-1 flex flex-col gap-2">
                            <div className={`flex justify-between items-center text-[10px] font-black uppercase tracking-widest ${isGlassMorph ? 'text-white/40' : 'opacity-40'}`}>
                                <span>Analysis Progress</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <div className={`h-1.5 w-full rounded-full overflow-hidden ${isGlassMorph ? 'bg-white/10' : 'bg-black/5'}`}>
                                <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {currentQuestionIndex > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${isGlassMorph ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-black/5 border border-black/5 hover:bg-black/10'}`}
                                >
                                    <ChevronRight size={24} className="rotate-180 opacity-50" />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={!isAnswered}
                                className={`h-14 px-10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50 ${isGlassMorph ? 'bg-white text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'btn-primary shadow-xl'}`}
                            >
                                {currentQuestionIndex === quiz.questions.length - 1 ? 'See Results' : 'Continue'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizRunner;
