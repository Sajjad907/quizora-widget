import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import QuizRunner from './components/QuizRunner';
import styles from './index.css?inline';
import { generateThemeStyles } from './utils/themeUtils';
import { getQuiz, setApiBase } from './api/quizApi';

// Embed Component Wrapper
const EmbedApp = ({ quizId, triggerSelector, layout, animation, autoOpen, shop }) => {
  const [isOpen, setIsOpen] = useState(autoOpen || layout === 'inline' || false);
  const [quiz, setQuiz] = useState(null);
  const [themeConfig, setThemeConfig] = useState(null);

  const containerRef = React.useRef(null);

  // Fetch quiz data with theme configuration
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quizData = await getQuiz(quizId);
        setQuiz(quizData);

        // Generate theme configuration
        if (quizData.theme) {
          const themeStyles = generateThemeStyles(quizData.theme);
          setThemeConfig(themeStyles);

          // Dispatch theme loaded event to update Shadow DOM styles
          window.dispatchEvent(new CustomEvent('quiz-theme-loaded', {
            detail: {
              cssVariables: themeStyles.cssVariables,
              fontUrl: themeStyles.fontUrl
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    };

    if (quizId && isOpen) {
      fetchQuizData();
    }
  }, [quizId, isOpen]);

  // Auto-scroll to widget when opened (especially for inline layout)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const effectiveLayout = quiz?.settings?.defaultLayout || layout || 'modal';
      if (effectiveLayout === 'inline') {
        setTimeout(() => {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [isOpen, quiz, layout]);

  useEffect(() => {
    // 1. Event Delegation for Triggers
    const handleGlobalClick = (e) => {
      if (triggerSelector) {
        const target = e.target.closest(triggerSelector);
        if (target) {
          console.log('Quizora Trigger detected via delegation:', triggerSelector);
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    // 2. Expose global API
    window.QuizWidget = {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(prev => !prev)
    };

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [triggerSelector]);

  if (!isOpen) return null;

  // Determine layout class
  const effectiveLayout = quiz?.settings?.defaultLayout || layout || 'modal';
  const position = quiz?.settings?.position || 'center';

  let layoutClass = 'widget-modal';
  if (effectiveLayout === 'fullscreen') layoutClass = 'widget-fullscreen';
  else if (effectiveLayout === 'inline') layoutClass = 'widget-inline';

  // Add position class for modals
  if (effectiveLayout === 'modal') {
    if (position === 'bottom-right') layoutClass += ' position-bottom-right';
    else if (position === 'sidebar-left') layoutClass += ' position-sidebar-left';
    else if (position === 'sidebar-right') layoutClass += ' position-sidebar-right';
  }

  // Determine animation class
  const effectiveAnimation = quiz?.theme?.animationStyle || animation || 'spring';
  const animationClass = `animate-quiz-${effectiveAnimation}`;

  // Check if branding should be shown
  const showBranding = quiz?.branding?.removeWatermark !== true;

  // Determine size styles for modal
  const sizeStyles = {};
  if (effectiveLayout === 'modal' && position === 'center') {
    if (quiz?.settings?.maxWidth) sizeStyles.maxWidth = `${quiz.settings.maxWidth}px`;
    if (quiz?.settings?.maxHeight) sizeStyles.maxHeight = `${quiz.settings.maxHeight}vh`;
  }

  return (
    <div ref={containerRef} className={`widget-base ${layoutClass} font-sans`}>
      {/* Widget Container */}
      <div
        className={`widget-container ${animationClass}`}
        style={sizeStyles}
      >
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl bg-blue-600/5 blur-[120px] rounded-full opacity-50" />
        </div>

        {/* Close Button (only for modal and fullscreen) */}
        {(effectiveLayout !== 'inline') && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 z-50 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2.5 transition-all outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Quiz Content */}
        <div className="flex-1 w-full relative z-10 min-h-0 flex flex-col">
          {quiz ? (
            quiz.merchantStatus !== 'ACTIVE' ? (
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center">
                  <span className="text-rose-500 text-2xl">⚠️</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Subscription Expired</h3>
                  <p className="text-white/60 text-sm max-w-xs mx-auto">
                    The merchant's subscription for this quiz has expired. Please contact the store owner.
                  </p>
                </div>
              </div>
            ) : (
              <QuizRunner quizId={quizId} initialQuiz={quiz} shop={shop} />
            )
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Branding Watermark */}
        {showBranding && (
          <div className="widget-branding">
            Powered by Quizora
          </div>
        )}
      </div>
    </div>
  );
};

// Initialize Logic
const initializeQuiz = (scriptTag) => {
  if (scriptTag.dataset.quizInitialized === 'true') return;
  
  const quizId = scriptTag.getAttribute('data-quiz-id');
  if (!quizId) return;

  scriptTag.dataset.quizInitialized = 'true';

  const serverUrl = scriptTag.getAttribute('data-server-url') || (scriptTag.src ? new URL(scriptTag.src).origin : null);
  setApiBase(serverUrl);

  const triggerSelector = scriptTag.getAttribute('data-trigger') || 'button[data-quiz-trigger]';
  const layout = scriptTag.getAttribute('data-layout') || 'modal';
  const animation = scriptTag.getAttribute('data-animation') || 'scale-up';
  const autoOpen = scriptTag.getAttribute('data-open') === 'true';
  const shop = scriptTag.getAttribute('data-shop');

  const timestamp = Math.floor(Math.random() * 1000000);
  const host = document.createElement('div');
  host.id = `quizora-host-${quizId}-${timestamp}`;
  host.className = 'quizora-widget-host';
  host.style.display = (layout === 'inline') ? 'block' : 'contents';

  if (scriptTag.parentNode) {
    scriptTag.parentNode.insertBefore(host, scriptTag.nextSibling);
  } else {
    document.body.appendChild(host);
  }

  const shadow = host.attachShadow({ mode: 'open' });

  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  const themeStyleTag = document.createElement('style');
  themeStyleTag.id = 'theme-variables';
  shadow.appendChild(themeStyleTag);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.id = 'google-fonts';
  shadow.appendChild(fontLink);

  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  const root = ReactDOM.createRoot(mountPoint);

  window.addEventListener('quiz-theme-loaded', (event) => {
    const { cssVariables, fontUrl } = event.detail;
    if (cssVariables) themeStyleTag.textContent = `:host { ${cssVariables} }`;
    if (fontUrl) fontLink.href = fontUrl;
  });

  root.render(
    <EmbedApp
      quizId={quizId}
      triggerSelector={triggerSelector}
      layout={layout}
      animation={animation}
      autoOpen={autoOpen}
      shop={shop}
    />
  );
  
  console.log(`[Quizora] Initialized widget: ${quizId} for shop: ${shop}`);
};

// Global scanner
const scanAndInit = () => {
  const scriptTags = document.querySelectorAll('script[src*="widget.js"]');
  scriptTags.forEach(initializeQuiz);
};

// Robust auto-run
const setup = () => {
  scanAndInit();

  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    mutations.forEach(m => {
      if (m.addedNodes.length > 0) shouldScan = true;
    });
    if (shouldScan) scanAndInit();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setInterval(scanAndInit, 2000);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
