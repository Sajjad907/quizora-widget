import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const QuestionStep = ({ question, questionId, onSelectOption, onInputChange, currentAnswers, theme, layoutMode, currentStep, totalSteps }) => {
    if (!question) return null;

    const isSplitHero = layoutMode === 'split-hero';
    const isMinimalist = layoutMode === 'minimalist';
    const isGlassMorph = layoutMode === 'glass-morph';
    const hasImages = question.options?.some(opt => opt.imageUrl);

    // Helper to check if an option is selected
    const isOptionSelected = (optId) => {
        return currentAnswers?.some(a => String(a.optionId) === String(optId));
    };

    return (
        <div className={`w-full animate-quiz-spring ${isSplitHero ? 'min-h-[80vh] flex flex-col justify-center' : isMinimalist ? 'max-w-2xl mx-auto space-y-10 py-6' : isGlassMorph ? 'max-w-4xl mx-auto space-y-14 py-10 px-4' : 'max-w-3xl mx-auto space-y-12 py-4'}`}>
            {/* Question Header */}
            <div className={`space-y-6 ${isSplitHero ? 'max-w-xl mx-auto mb-12 text-center' : 'text-center'}`}>
                {isSplitHero ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-[12px] font-black uppercase tracking-[0.5em] text-primary">
                            SECTION {currentStep}
                        </p>
                        <div className="h-px w-12 bg-primary/30" />
                    </div>
                ) : !isMinimalist ? (
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                {(question.type === 'multiple_choice' || question.type === 'checkboxes') ? 'Multiple Selection' : 'Choose One'}
                            </span>

                        </div>
                    </div>
                ) : null}

                <div className="space-y-4">
                    <h2 className={`${isSplitHero ? 'text-4xl md:text-5xl' : 'text-4xl md:text-5xl'} font-black tracking-tight leading-[1.1] text-center`} style={{ color: 'var(--text-main)', fontFamily: 'var(--font-main)' }}>
                        {question.text}
                    </h2>

                    {question.description && (
                        <p className={`${isSplitHero ? 'text-base md:text-lg' : 'text-lg md:text-xl'} font-medium max-w-xl mx-auto leading-relaxed opacity-50 text-center`}>
                            {question.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Options Grid */}
            <div className={`${hasImages ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-3 max-w-2xl mx-auto'} ${isSplitHero ? 'px-6' : ''}`}>
                {(question.type === 'multiple_choice' || question.type === 'single_choice' || question.type === 'checkboxes') ? (

                    question.options?.map((option, idx) => {
                        const optId = String(option.id || option._id);
                        const isSelected = isOptionSelected(optId);

                        return hasImages ? (
                            <button
                                key={optId}
                                type="button"
                                onClick={() => onSelectOption(questionId, optId)}
                                className={`group relative flex flex-col gap-4 p-4 transition-all duration-500 border-2 ${isGlassMorph ? 'rounded-[3rem] backdrop-blur-3xl' : 'rounded-[2.5rem]'}`}
                                style={{
                                    background: isSelected ? (isGlassMorph ? 'rgba(var(--primary-rgb), 0.25)' : 'rgba(var(--primary-rgb), 0.15)') : (isGlassMorph ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)'),
                                    borderColor: isSelected ? 'var(--primary)' : (isGlassMorph ? 'rgba(255,255,255,0.1)' : 'transparent'),
                                    boxShadow: isSelected ? `0 20px 40px rgba(var(--primary-rgb), ${isGlassMorph ? '0.4' : '0.2'})` : 'none',
                                    transform: isSelected ? 'scale(1.02) translateY(-5px)' : 'scale(1)',
                                }}
                            >
                                <div className="aspect-square rounded-[1.75rem] overflow-hidden bg-white/5 border border-white/5 relative">
                                    <img src={option.imageUrl} alt={option.text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl">
                                                <CheckCircle2 size={24} className="text-primary" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="px-2 pb-2">
                                    <span className="text-base font-bold text-center block" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                                        {option.text}
                                    </span>
                                </div>
                            </button>
                        ) : (
                            <button
                                key={optId}
                                type="button"
                                onClick={() => onSelectOption(questionId, optId)}
                                className={`group flex items-center gap-6 p-6 transition-all duration-300 border-2 ${isSplitHero ? 'rounded-2xl' : isGlassMorph ? 'rounded-[2.5rem] backdrop-blur-2xl' : 'rounded-[2rem]'}`}
                                style={{
                                    background: isSelected ? (isGlassMorph ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(var(--primary-rgb), 0.1)') : (isGlassMorph ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.03)'),
                                    borderColor: isSelected ? 'var(--primary)' : (isGlassMorph ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'),
                                    boxShadow: isSelected ? `0 12px 30px rgba(var(--primary-rgb), ${isGlassMorph ? '0.3' : '0.15'})` : 'none',
                                    transform: isSelected ? 'translateY(-4px)' : 'none',
                                }}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center font-black text-lg transition-all ${isSplitHero ? 'rounded-xl' : 'rounded-2xl'}`}
                                    style={{
                                        background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                                        color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.3)',
                                        boxShadow: isSelected ? '0 8px 16px rgba(var(--primary-rgb), 0.3)' : 'none',
                                    }}
                                >
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className={`font-bold flex-1 ${isSplitHero ? 'text-lg' : 'text-xl'}`} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-main)', opacity: isSelected ? 1 : 0.7 }}>
                                    {option.text}
                                </span>
                                <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                                    style={{
                                        borderColor: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                                        background: isSelected ? 'var(--primary)' : 'transparent',
                                    }}
                                >
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="relative group">
                        <textarea
                            placeholder="Share your thoughts here..."
                            value={currentAnswers?.[0]?.value || ''}
                            onChange={(e) => onInputChange(questionId, e.target.value)}
                            className="w-full p-8 min-h-[220px] bg-white/5 border-2 border-white/10 rounded-[2.5rem] outline-none transition-all font-medium text-xl resize-none focus:border-primary focus:bg-primary/5"
                            style={{ color: 'var(--text-main)', lineHeight: '1.6' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionStep;
