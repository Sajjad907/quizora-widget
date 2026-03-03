import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCcw, Sparkles, CheckCircle2, Package, ArrowRight, Share2, Star } from 'lucide-react';

// Mini confetti burst on load

const StarRating = ({ score }) => {
    const filled = Math.round((score / 100) * 5);
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < filled ? 'currentColor' : 'none'} className={i < filled ? 'text-yellow-400' : 'text-white/20'} />
            ))}
        </div>
    );
};

const ResultStep = ({ outcome, products, scores, theme, onRetake }) => {
    const layoutMode = theme?.layoutMode || 'classic';
    const isMinimalist = layoutMode === 'minimalist';
    const isGlassMorph = layoutMode === 'glass-morph';
    const isSplitHero = layoutMode === 'split-hero';

    const [copied, setCopied] = useState(false);

    const displayOutcome = outcome || {
        title: "Analysis Complete",
        description: "Thank you for completing our analysis. We've captured your preferences!"
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: `My Result: ${displayOutcome.title}`, text: displayOutcome.description, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden transition-colors duration-700 ${isGlassMorph ? 'bg-slate-900' : ''}`} style={{ backgroundColor: isGlassMorph ? undefined : 'var(--bg-main)', color: 'var(--text-main)' }}>

            {/* GLASS MORPH BACKGROUND BLOBS */}
            {isGlassMorph && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]" />
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-10 z-10 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-12 md:space-y-20">

                    {/* ===== SUCCESS HEADER ===== */}
                    <div className="text-center space-y-8 animate-quiz-spring pt-4 md:pt-10">
                        {/* Status Chip */}
                        {!isMinimalist && (
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md text-emerald-400">
                                    <div className="relative flex h-2 w-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em]">Perfect Match Found</span>
                                </div>
                            </div>
                        )}

                        {/* Outcome Title & Main Icon */}
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[80px]" />
                                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <CheckCircle2 size={40} className="text-white relative z-10" strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 px-4">
                                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.95]"
                                    style={{ color: 'var(--text-main)' }}>
                                    <span className="block text-sm md:text-lg mb-4 tracking-[0.4em] font-bold" style={{ color: 'rgba(var(--text-main-rgb), 0.4)' }}>YOUR RECOMMENDED MATCH</span>
                                    <span className="block text-sm md:text-lg mb-4 tracking-[0.4em] font-bold" style={{ color: 'rgba(var(--text-main-rgb), 0.4)' }}>YOUR RECOMMENDED MATCH</span>
                                    <span className="bg-gradient-to-b from-current to-current/60 bg-clip-text text-transparent">{displayOutcome.title}</span>
                                </h2>
                                {displayOutcome.description && (
                                    <p className="max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed" style={{ color: 'rgba(var(--text-main-rgb), 0.5)' }}>
                                        {displayOutcome.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center justify-center gap-3">
                            <button onClick={handleShare} className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 active:scale-95">
                                <Share2 size={14} className="opacity-40 group-hover:opacity-100 group-hover:text-primary transition-all" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Link Copied!' : 'Share Result'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ===== MATCH ANALYSIS SECTION ===== */}
                    {scores && Object.keys(scores).length > 0 && (
                        <div className="space-y-8 animate-quiz-smooth">
                            <div className="flex items-center justify-between px-2">
                                <div className="space-y-1">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: 'rgba(var(--text-main-rgb), 0.3)' }}>Analysis Report</h3>
                                    <div className="h-0.5 w-8 bg-primary/40 rounded-full" />
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10">
                                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(var(--text-main-rgb), 0.4)' }}>AI Verified Correlation</span>
                                </div>
                            </div>

                            <div className={`rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative overflow-hidden shadow-2xl ${isGlassMorph ? 'bg-white/[0.03] backdrop-blur-3xl border-white/10' : 'bg-white/[0.02] border border-white/5'}`}>
                                {Object.entries(scores).map(([key, val], idx) => (
                                    <div key={key} className="space-y-4 group">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest block" style={{ color: 'rgba(var(--text-main-rgb), 0.3)' }}>Factor {idx + 1}</span>
                                                <span className="text-base font-bold capitalize" style={{ color: 'rgba(var(--text-main-rgb), 0.9)' }}>{key}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-lg font-black text-primary leading-none">{val}%</span>
                                                <StarRating score={val} />
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full rounded-full bg-white/5 relative overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out delay-300"
                                                style={{
                                                    width: `${val}%`,
                                                    background: 'linear-gradient(to right, var(--primary), var(--accent))',
                                                    boxShadow: `0 0 15px rgba(var(--primary-rgb), 0.4)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== PRODUCT DISCOVERY ===== */}
                    <div className="space-y-10 md:space-y-16">
                        <div className="text-center space-y-4 px-4">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                                curated Selection
                            </div>
                            <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
                                Recommended for <span className="text-primary italic">You</span>.
                            </h3>
                            <p className="max-w-md mx-auto text-sm font-medium leading-relaxed" style={{ color: 'rgba(var(--text-main-rgb), 0.4)' }}>
                                Our AI analyzed {products?.length || 0} products based on your profile to find these essentials.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 pb-10 animate-quiz-smooth">
                            {products && products.length > 0 ? (
                                products.map((prod, idx) => (
                                    <div key={idx} className={`group flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:translate-y-[-12px] shadow-lg hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${isGlassMorph ? 'bg-white/[0.03] backdrop-blur-3xl border-white/10 hover:bg-white/[0.06]' : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'}`}>
                                        {/* Product Image Area */}
                                        <div className="aspect-square relative overflow-hidden bg-white/[0.02] m-3 rounded-[2rem]">
                                            {prod.imageUrl ? (
                                                <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={prod.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-5">
                                                    <Package size={80} strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Badge */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                                                    Editor's Choice
                                                </div>
                                            </div>

                                            {/* Hover Action Overlay */}
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                                    <ArrowRight size={24} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 pt-4 space-y-6">
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-bold leading-tight line-clamp-2 min-h-[3.5rem] transition-colors uppercase tracking-tight" style={{ color: 'rgba(var(--text-main-rgb), 0.9)' }}>{prod.title}</h4>
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <span className="text-2xl font-black" style={{ color: 'var(--text-main)' }}>{prod.price || '$0.00'}</span>
                                                        <div className="flex items-center gap-1.5" style={{ color: 'rgba(var(--text-main-rgb), 0.3)' }}>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                                                            </div>
                                                            <span className="text-[8px] font-bold uppercase tracking-widest">530 Reviews</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-black/20 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                                        <ShoppingBag size={18} />
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-xl">
                                                Finalize Selection
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center rounded-[3rem] bg-white/[0.01] border-2 border-dashed border-white/5 space-y-6">
                                    <Package size={64} className="mx-auto opacity-10" />
                                    <div className="space-y-2">
                                        <p className="font-black text-lg opacity-40 uppercase tracking-widest">Collection Empty</p>
                                        <p className="text-xs opacity-20 max-w-xs mx-auto">We couldn't find exact product matches, but we recommend these categories.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Retake Footer (only if not using sticky footer) */}
                    <div className="pb-32 text-center">
                        <button
                            onClick={onRetake || (() => window.location.reload())}
                            className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2 mx-auto"
                        >
                            <RefreshCcw size={12} />
                            Reset Selection & Retake
                        </button>
                    </div>
                </div>
            </div>

            {/* ===== STICKY FOOTER ACTIONS ===== */}
            <div className={`p-6 md:p-8 backdrop-blur-3xl sticky bottom-0 z-50 transition-all border-t ${isGlassMorph ? 'bg-white/[0.05] border-white/10 mx-6 mb-6 rounded-[2.5rem] bottom-4' : 'bg-[#0a0a0b]/80 border-white/5'}`}>
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onRetake || (() => window.location.reload())}
                        className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all active:scale-95 ${isGlassMorph ? 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-white/5 border border-white/5 text-white/20 hover:text-white'}`}
                        title="Retake Quiz"
                    >
                        <RefreshCcw size={20} />
                    </button>

                    <button className="flex-1 h-16 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-white/10 transition-all hover:bg-white/90 active:scale-[0.98] flex items-center justify-center gap-3">
                        <ShoppingBag size={20} />
                        Purchase My Routine
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultStep;
