import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import QuizRunner from './components/QuizRunner';
import styles from './index.css?inline';
import { generateThemeStyles } from './utils/themeUtils';
import { getQuiz } from './api/quizApi';

// Embed Component Wrapper
const EmbedApp = ({ quizId, triggerSelector, layout, animation }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      // Only scroll if layout is 'inline' or 'modal' (to ensure visibility)
      // For fullscreen, it covers everything anyway.
      // But 'inline' is the critical one.
      const effectiveLayout = quiz?.settings?.defaultLayout || layout || 'modal';

      if (effectiveLayout === 'inline') {
        setTimeout(() => {
          containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [isOpen, quiz, layout]);

  useEffect(() => {
    // 1. Listen for clicks on the trigger selector (outside Shadow DOM)
    const setupTrigger = () => {
      console.log('Setting up triggers with selector:', triggerSelector);
      if (triggerSelector) {
        const triggers = document.querySelectorAll(triggerSelector);
        console.log('Found triggers:', triggers.length);
        triggers.forEach(el => {
          el.addEventListener('click', (e) => {
            console.log('Trigger clicked');
            e.preventDefault();
            setIsOpen(true);
            console.log('Set isOpen to true');
          });
        });
      }
    };

    setupTrigger();

    // 2. Expose global API
    window.QuizWidget = {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen(prev => !prev)
    };

    return () => {
      // Cleanup if needed
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
            <QuizRunner quizId={quizId} initialQuiz={quiz} />
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
const init = () => {
  // Find the script tag that loaded this file to read attributes
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget"]');
  const quizId = scriptTag?.getAttribute('data-quiz-id') || '698f06bb22c36a54f38075a7';
  const triggerSelector = scriptTag?.getAttribute('data-trigger') || 'button[data-quiz-trigger]';
  const layout = scriptTag?.getAttribute('data-layout') || 'modal'; // modal, fullscreen, inline
  const animation = scriptTag?.getAttribute('data-animation') || 'scale-up'; // scale-up, fade-in, slide-up

  // Create a container (Host)
  const host = document.createElement('div');
  const timestamp = Date.now();
  host.id = `quiz-widget-host-${timestamp}`;

  // Decide where to mount:
  // If script tag exists and has a parent that is not head, mount after script.
  // Otherwise append to body.
  if (scriptTag && scriptTag.parentNode && scriptTag.parentNode.tagName !== 'HEAD') {
    scriptTag.parentNode.insertBefore(host, scriptTag.nextSibling);
  } else {
    document.body.appendChild(host);
  }

  // Make host ID available globally for potential scrolling usage (though we use ref now)
  window.quizWidgetHostId = timestamp;

  // Attach Shadow DOM
  const shadow = host.attachShadow({ mode: 'open' });

  // Inject Base Styles
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  // Create a style tag for dynamic theme variables (will be updated when quiz loads)
  const themeStyleTag = document.createElement('style');
  themeStyleTag.id = 'theme-variables';
  shadow.appendChild(themeStyleTag);

  // Create a link tag for Google Fonts (will be updated when quiz loads)
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.id = 'google-fonts';
  shadow.appendChild(fontLink);

  // Mount Point for React
  const mountPoint = document.createElement('div');
  shadow.appendChild(mountPoint);

  // Create React root
  const root = ReactDOM.createRoot(mountPoint);

  // Render with configuration
  const renderApp = () => {
    root.render(
      <EmbedApp
        quizId={quizId}
        triggerSelector={triggerSelector}
        layout={layout}
        animation={animation}
      />
    );
  };

  // Listen for theme updates from the app
  window.addEventListener('quiz-theme-loaded', (event) => {
    const { cssVariables, fontUrl } = event.detail;

    // Update theme variables
    if (cssVariables) {
      themeStyleTag.textContent = `:host { ${cssVariables} }`;
    }

    // Update Google Fonts
    if (fontUrl) {
      fontLink.href = fontUrl;
    }
  });

  renderApp();

  console.log("Quiz Widget Initialized (Shadow DOM) for ID:", quizId);
  console.log("Mounting approach:", scriptTag && scriptTag.parentNode.tagName !== 'HEAD' ? "After Script" : "Body Append");
};

// Auto-run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
