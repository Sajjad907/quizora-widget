import React, { useState } from 'react';
import { ShoppingBag, RefreshCcw, Sparkles, CheckCircle2, Package, ArrowRight, Share2, Star, Loader2 } from 'lucide-react';

const ResultStep = ({ outcome, products, scores, theme, onRetake, shop }) => {
    const layoutMode = theme?.layoutMode || 'classic';
    const isMinimalist = layoutMode === 'minimalist';
    const isGlassMorph = layoutMode === 'glass-morph';
    const isSplitHero = layoutMode === 'split-hero';

    const [copied, setCopied] = useState(false);
    const [cartLoading, setCartLoading] = useState({}); // { [productId]: 'loading' | 'done' | 'error' }

    // Resolve shop domain
    const shopDomain = shop || 'www.dermamage.com';
    const shopBaseUrl = shopDomain.startsWith('http') ? shopDomain : `https://${shopDomain}`;

    const displayOutcome = outcome || {
        title: "Analysis Complete",
        description: "Thank you for completing our analysis. We've captured your preferences!"
    };

    // ── Add to Cart via Shopify API ─────────────────────────
    const handleAddToCart = async (prod, idx) => {
        const key = prod.productId || prod.handle || idx;

        setCartLoading(prev => ({ ...prev, [key]: 'loading' }));

        try {
            // Try to add by variant ID first; fall back to handle-based lookup
            let variantId = prod.variantId;

            if (!variantId && prod.handle) {
                // Fetch the product JSON from Shopify to get the first variant ID
                const pResp = await fetch(`${shopBaseUrl}/products/${prod.handle}.js`);
                if (pResp.ok) {
                    const pData = await pResp.json();
                    variantId = pData.variants?.[0]?.id;
                }
            }

            if (variantId) {
                const cartResp = await fetch(`${shopBaseUrl}/cart/add.js`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: variantId, quantity: 1 }),
                });

                if (!cartResp.ok) throw new Error('Cart add failed');

                setCartLoading(prev => ({ ...prev, [key]: 'done' }));

                // Navigate to the product page after a short delay so user sees the tick
                setTimeout(() => {
                    const productUrl = prod.shopUrl || `${shopBaseUrl}/products/${prod.handle}`;
                    window.open(productUrl, '_blank');
                }, 600);
            } else {
                throw new Error('Variant ID not found');
            }
        } catch (err) {
            console.warn('Add to cart via API failed, opening product page directly.', err);
            setCartLoading(prev => ({ ...prev, [key]: 'error' }));
            // Graceful fallback: just open the product page
            const productUrl = prod.shopUrl || `${shopBaseUrl}/products/${prod.handle}`;
            window.open(productUrl, '_blank');
        } finally {
            setTimeout(() => {
                setCartLoading(prev => ({ ...prev, [key]: undefined }));
            }, 2000);
        }
    };
    // ────────────────────────────────────────────────────────

    const handleShare = () => {
        const shareTitle = `My Dermamage Skin Analysis: ${displayOutcome.title}`;
        const shareText = `I just found my perfect skin routine! My result: ${displayOutcome.title}. Take the quiz to find yours.`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl
            }).catch(() => {
                copyToClipboard(shareUrl);
            });
        } else {
            copyToClipboard(shareUrl);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className={`flex flex-col h-full overflow-hidden transition-colors duration-700 ${isGlassMorph ? 'bg-slate-900' : ''}`} style={{ backgroundColor: isGlassMorph ? undefined : 'var(--bg-main)', color: 'var(--text-main)' }}>

            {/* ===== PREMIUM BACKGROUND BLOBS ===== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/15 blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-500/10 blur-[100px] animate-bounce" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[20%] left-[10%] w-[30%] h-[30%] rounded-full bg-emerald-500/10 blur-[80px]" />
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-10 z-10 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">

                    {/* ===== SUCCESS HERO CARD ===== */}
                    <div className="relative group animate-quiz-spring mt-4 md:mt-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-white/5 to-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative flex flex-col items-center bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center space-y-10 overflow-hidden shadow-2xl">

                            {/* Decorative Sparkle */}
                            <div className="absolute top-6 right-8 opacity-20 rotate-12">
                                <Sparkles size={32} className="text-primary" />
                            </div>

                            {/* Status Chip */}
                            <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                <div className="relative flex h-2 w-2">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></span>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Perfect Match Found</span>
                            </div>

                            {/* Title Section */}
                            <div className="space-y-8 max-w-3xl">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] opacity-40 mb-2">My Tailored Routine</h4>
                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                        {displayOutcome.title}
                                    </h2>
                                </div>

                                {displayOutcome.description && (
                                    <p className="text-sm md:text-lg font-medium leading-relaxed max-w-2xl mx-auto opacity-70">
                                        {displayOutcome.description}
                                    </p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                <button onClick={handleShare} className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 active:scale-95 shadow-lg">
                                    <Share2 size={16} className="text-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-widest text-white">{copied ? 'Link Copied!' : 'Share Results'}</span>
                                </button>

                                <div className="hidden md:flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400/60 transition-all">
                                    <CheckCircle2 size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Dermatologically Matched</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ===== MATCH ANALYSIS SECTION (Removed as requested) ===== */}

                    {/* ===== PRODUCT DISCOVERY ===== */}
                    <div className="space-y-12 md:space-y-16 animate-quiz-smooth">
                        <div className="relative">
                            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 blur-[80px] rounded-full" />

                            <div className="relative text-center md:text-left space-y-4 flex flex-col md:flex-row items-center md:items-end justify-between border-b border-white/5 pb-10">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.35em]">
                                        <Sparkles size={12} />
                                        Curated Selection
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                        Recommended for <span className="text-primary italic underline decoration-primary/20 underline-offset-8">You</span>.
                                    </h3>
                                </div>
                                <p className="max-w-[240px] text-xs font-bold leading-relaxed opacity-40 uppercase tracking-widest text-center md:text-right">
                                    AI analyzed {products?.length || 0} products based on your profile.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-10">
                            {products && products.length > 0 ? (
                                products.map((prod, idx) => (
                                    <div key={idx} className={`group relative flex flex-col rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:translate-y-[-12px] shadow-2xl bg-white/5 backdrop-blur-3xl border border-white/10`}>

                                        {/* Product Glow (for Top Pick) */}
                                        {idx === 0 && (
                                            <div className="absolute -inset-2 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        )}

                                        {/* Product Image Area */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-white/5 m-3 rounded-[2rem] flex items-center justify-center p-8">
                                            {prod.imageUrl ? (
                                                <img src={prod.imageUrl} className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-[1.12]" alt={prod.title} />
                                            ) : (
                                                <Package size={60} className="opacity-10" />
                                            )}

                                            {/* Premium Badge */}
                                            {idx === 0 && (
                                                <div className="absolute top-5 left-5">
                                                    <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/90 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl">
                                                        <Sparkles size={10} />
                                                        Expert Choice
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-8 pt-4 space-y-6 flex flex-col items-center flex-1 relative z-10">
                                            <div className="space-y-3 text-center w-full">
                                                <div className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.3em]">Step 0{idx + 1}</div>
                                                <h4 className="text-base md:text-lg font-black leading-tight line-clamp-2 min-h-[3rem] opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {prod.title}
                                                </h4>
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-2xl font-black">{prod.price || '$0.00'}</span>
                                                    <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/5 border border-white/5">
                                                        <div className="flex gap-0.5 text-yellow-500">
                                                            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                                        </div>
                                                        <span className="text-[10px] font-bold opacity-40">4.9/5</span>
                                                    </div>
                                                </div>

                                                {/* AI Expert Reason */}
                                                {prod.reason && (
                                                    <div className="pt-2 px-2">
                                                        <p className="text-[10px] md:text-xs leading-relaxed opacity-50 italic font-medium">
                                                            <span className="text-primary not-italic font-black mr-1 decoration-primary/30 underline underline-offset-4">Why it's for you:</span>
                                                            "{prod.reason}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add to Cart Button with Shopify Integration */}
                                            {(() => {
                                                const key = prod.productId || prod.handle || idx;
                                                const btnState = cartLoading[key];
                                                return (
                                                    <button
                                                        onClick={() => handleAddToCart(prod, idx)}
                                                        disabled={btnState === 'loading'}
                                                        className={`w-full py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-[0.95] shadow-xl flex items-center justify-center gap-2 mt-auto disabled:opacity-70 disabled:cursor-not-allowed
                                                            ${btnState === 'done' ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:brightness-110'}`}
                                                    >
                                                        {btnState === 'loading' ? (
                                                            <><Loader2 size={16} className="animate-spin" /> Adding...</>
                                                        ) : btnState === 'done' ? (
                                                            <><CheckCircle2 size={16} /> Added!</>
                                                        ) : (
                                                            <><ShoppingBag size={16} /> Add to Cart</>
                                                        )}
                                                    </button>
                                                );
                                            })()}
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
            <div className={`mt-auto p-6 md:p-8 backdrop-blur-3xl sticky bottom-0 z-50 transition-all border-t ${isGlassMorph ? 'bg-[#0a0f1a]/80 border-white/10 mx-4 md:mx-6 mb-4 md:mb-6 rounded-[2.5rem] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)]' : 'bg-[#0a0a0b]/90 border-white/5'}`}>
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onRetake || (() => window.location.reload())}
                        className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${isGlassMorph ? 'bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10' : 'bg-white/5 border border-white/5 text-white/20 hover:text-white'}`}
                        title="Retake Quiz"
                    >
                        <RefreshCcw size={20} />
                    </button>

                    <button
                        onClick={() => window.open(shopBaseUrl, '_blank')}
                        className="flex-1 h-14 md:h-16 bg-white text-black rounded-2xl font-black text-[11px] md:text-[12px] uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:bg-primary hover:text-white hover:shadow-[0_0_40px_rgba(201,169,110,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <ShoppingBag size={20} />
                        Purchase My Routine
                        <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultStep;
