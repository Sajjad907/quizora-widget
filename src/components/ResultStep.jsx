import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCcw, Sparkles, CheckCircle2, Package, ArrowRight, Share2, Star } from 'lucide-react';

// Mini confetti burst on load
const useConfetti = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return;
        const colors = ['#6366f1', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6'];
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(container);

        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const duration = Math.random() * 2 + 2;
            const rotation = Math.random() * 360;
            piece.style.cssText = `
        position:absolute;
        top:-20px;
        left:${left}%;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
        animation:confetti-fall ${duration}s ${delay}s ease-in forwards;
        transform:rotate(${rotation}deg);
        opacity:0.9;
      `;
            container.appendChild(piece);
        }

        const style = document.createElement('style');
        style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 0.9; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
        document.head.appendChild(style);

        const cleanup = setTimeout(() => {
            container.remove();
            style.remove();
        }, 4000);

        return () => {
            clearTimeout(cleanup);
            container.remove();
            style.remove();
        };
    }, [enabled]);
};

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

    useConfetti(!isMinimalist);
    const [copied, setCopied] = useState(false);

    if (!outcome) return null;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: `My Result: ${outcome.title}`, text: outcome.description, url: window.location.href });
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

            <div className="flex-1 overflow-y-auto px-6 py-8 md:py-10 z-10">
                <div className="max-w-4xl mx-auto space-y-10">

                    {/* ===== SUCCESS HEADER ===== */}
                    <div className="text-center space-y-12 animate-quiz-spring">
                        {/* Status Chip */}
                        {!isMinimalist && (
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Perfect Match Found</span>
                                </div>
                            </div>
                        )}

                        {/* Outcome Title & Image/Icon */}
                        <div className="space-y-8">
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>
                                    <div className="relative w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl border border-white/20">
                                        <CheckCircle2 size={64} className="text-white drop-shadow-lg" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] uppercase"
                                    style={{ color: 'var(--text-main)' }}>
                                    {outcome.title}
                                </h2>
                                <p className="max-w-xl mx-auto text-lg md:text-xl font-medium leading-relaxed opacity-60">
                                    {outcome.description}
                                </p>
                            </div>
                        </div>

                        {/* Share & Retake Quick Actions */}
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={handleShare} className="group flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                                <Share2 size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs font-bold uppercase tracking-widest">{copied ? 'Link Copied!' : 'Share Result'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ===== OUTCOME TAGS ===== */}
                    {outcome.tags && outcome.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {outcome.tags.map((tag, i) => (
                                <span key={i} className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ===== SCORE BREAKDOWN ===== */}
                    {scores && Object.keys(scores).length > 0 && (
                        <div className={`rounded-[2.5rem] p-10 space-y-8 animate-quiz-smooth relative overflow-hidden shadow-2xl ${isGlassMorph ? 'bg-white/5 backdrop-blur-3xl border-white/10' : 'bg-white/[0.02] border border-white/5'}`}>
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Match Analysis</h4>
                                <div className="text-[9px] font-black px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                                    AI Verified Data
                                </div>
                            </div>

                            <div className="grid gap-6">
                                {Object.entries(scores).map(([key, val]) => (
                                    <div key={key} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-base font-bold opacity-80">{key}</span>
                                            <div className="flex items-center gap-4">
                                                <StarRating score={val} />
                                                <span className="text-sm font-black w-10 text-right opacity-90">{val}%</span>
                                            </div>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${val}%`,
                                                    background: 'linear-gradient(to right, var(--primary), var(--accent))',
                                                    boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ===== DIVIDER ===== */}
                    <div className="flex items-center gap-4" style={{ opacity: 0.15 }}>
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--text-main))' }} />
                        <Sparkles size={14} />
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--text-main))' }} />
                    </div>

                    {/* ===== PRODUCT GRID ===== */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-60">Personalized Collection</h3>
                            {products && products.length > 0 && (
                                <span className="text-[10px] font-black px-2 py-1 rounded bg-white/5 opacity-40 uppercase tracking-widest">
                                    {products.length} Items Found
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6 animate-quiz-smooth">
                            {products && products.length > 0 ? (
                                products.map((prod, idx) => (
                                    <div key={idx} className={`group flex flex-col rounded-[2rem] overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl ${isGlassMorph ? 'bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/10' : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10'}`}>
                                        {/* Product Image */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-white/[0.01]">
                                            {prod.imageUrl ? (
                                                <img src={prod.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={prod.title} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-10">
                                                    <Package size={64} strokeWidth={1} />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                                                    Best Choice
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 space-y-4">
                                            <div className="space-y-1">
                                                <h4 className="text-base font-bold leading-tight line-clamp-2 min-h-[3rem] opacity-90">{prod.title}</h4>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{prod.price || '$0.00'}</span>
                                                    <div className="flex items-center gap-1 opacity-40">
                                                        <Star size={10} fill="currentColor" />
                                                        <span className="text-[10px] font-bold tracking-widest uppercase">4.9 / 5</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.15em] transition-all hover:bg-white/90 active:scale-95 shadow-xl">
                                                Add To Selection
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 text-center rounded-[2.5rem] border-2 border-dashed border-white/5 space-y-6">
                                    <Package size={64} className="mx-auto opacity-10" />
                                    <div className="space-y-2">
                                        <p className="font-black text-base opacity-40 uppercase tracking-widest">No Exact Matches found</p>
                                        <p className="text-xs opacity-20 max-w-xs mx-auto">We're updating our inventory daily. Please check back soon for tailored results.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== FOOTER ACTIONS ===== */}
            <div className={`p-6 md:p-8 backdrop-blur-3xl sticky bottom-0 z-30 transition-all ${isGlassMorph ? 'bg-white/5 border-t border-white/10 mx-6 mb-6 rounded-[2.5rem] bottom-4' : 'bg-white/90 border-t border-black/5'}`} style={{ backgroundColor: isGlassMorph ? undefined : 'var(--bg-main)', borderColor: isGlassMorph ? undefined : 'rgba(255,255,255, 0.05)' }}>
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onRetake || (() => window.location.reload())}
                        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                        title="Retake Identification"
                    >
                        <RefreshCcw size={20} />
                    </button>

                    <button className="flex-1 h-16 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-white/90 active:scale-[0.98] flex items-center justify-center gap-3">
                        <ShoppingBag size={20} />
                        Finalize My Collection
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultStep;
