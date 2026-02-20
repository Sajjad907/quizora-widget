import React, { useState } from 'react';
import { Mail, ArrowRight, Shield, Users, Zap } from 'lucide-react';

const EmailStep = ({ onNext, theme }) => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [focused, setFocused] = useState(null);

    const layoutMode = theme?.layoutMode || 'classic';
    const isGlassMorph = layoutMode === 'glass-morph';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            onNext({ email, firstName });
        }
    };

    const inputStyle = (field) => ({
        width: '100%',
        padding: '16px 20px',
        fontSize: '15px',
        fontWeight: '600',
        outline: 'none',
        transition: 'all 0.2s',
        borderRadius: '14px',
        border: focused === field
            ? '2px solid var(--primary)'
            : (isGlassMorph ? '2px solid rgba(255,255,255,0.05)' : '2px solid rgba(var(--text-main-rgb), 0.08)'),
        background: focused === field
            ? (isGlassMorph ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(var(--primary-rgb), 0.06)')
            : (isGlassMorph ? 'rgba(255,255,255,0.03)' : 'rgba(var(--text-main-rgb), 0.04)'),
        color: 'var(--text-main)',
        backdropFilter: isGlassMorph ? 'blur(10px)' : 'none',
        boxShadow: focused === field ? '0 0 0 4px rgba(var(--primary-rgb), 0.2)' : 'none',
    });

    return (
        <div className={`flex flex-col items-center justify-center min-h-full px-6 py-14 animate-fade-in relative overflow-hidden transition-colors duration-700 ${isGlassMorph ? 'bg-slate-900' : ''}`} style={{ backgroundColor: isGlassMorph ? undefined : 'var(--bg-main)' }}>

            {/* GLASS MORPH BACKGROUND BLOBS */}
            {isGlassMorph && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[100px]" />
                </div>
            )}

            <div className="max-w-md w-full space-y-8 z-10">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 flex items-center justify-center animate-scale-up rounded-3xl"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                boxShadow: '0 12px 36px rgba(var(--primary-rgb), 0.5)'
                            }}>
                            <Mail size={38} className="text-white" />
                        </div>
                        <div className="absolute -inset-2 rounded-3xl blur-2xl opacity-25 animate-pulse"
                            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }} />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ background: 'rgba(var(--primary-rgb), 0.1)', border: '1px solid rgba(var(--primary-rgb), 0.2)', color: 'var(--primary)' }}>
                        <Zap size={11} />
                        Almost there!
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight" style={{ color: 'var(--text-main)' }}>
                        Get Your Results
                    </h2>
                    <p className="font-medium text-sm leading-relaxed" style={{ color: 'var(--text-main)', opacity: 0.55 }}>
                        We'll send your personalized recommendations + exclusive member-only deals to your inbox.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="First name (optional)"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        style={inputStyle('name')}
                    />
                    <input
                        type="email"
                        placeholder="your@email.com *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        required
                        style={inputStyle('email')}
                    />

                    {/* Privacy note */}
                    <div className="flex items-center gap-2 text-xs px-1" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
                        <Shield size={12} />
                        <span className="font-medium">We never share your data. Unsubscribe anytime, for free.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={!email || !email.includes('@')}
                        className="w-full py-5 font-black text-lg flex items-center justify-center gap-3 text-white rounded-2xl transition-all"
                        style={{
                            background: email && email.includes('@')
                                ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                                : 'rgba(var(--text-main-rgb), 0.1)',
                            color: email && email.includes('@') ? 'white' : 'rgba(var(--text-main-rgb), 0.3)',
                            boxShadow: email && email.includes('@') ? '0 8px 28px rgba(var(--primary-rgb), 0.45)' : 'none',
                            cursor: email && email.includes('@') ? 'pointer' : 'not-allowed',
                            transform: 'none',
                        }}
                        onMouseEnter={e => { if (email && email.includes('@')) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        Show My Results
                        <ArrowRight size={22} />
                    </button>
                </form>

                {/* Social proof */}
                <div className="flex items-center gap-4 justify-center">
                    {/* Avatar stack */}
                    <div className="flex">
                        {['#6366f1', '#ec4899', '#10b981', '#f59e0b'].map((c, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-xs font-black -ml-2 first:ml-0"
                                style={{ background: c, borderColor: 'var(--bg-main)' }}>
                                {['S', 'J', 'A', 'R'][i]}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-main)', opacity: 0.4 }}>
                        <Users size={12} />
                        Join 50,000+ happy customers
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailStep;
