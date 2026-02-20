/**
 * Theme Utilities for Production-Grade Widget Customization
 * Generates comprehensive CSS variables from theme configuration
 */

/**
 * Generates CSS variables string from theme configuration
 * @param {Object} theme - The theme object from quiz data
 * @return {Object} - { cssVariables: string, fontUrl: string, fontFamily: string }
 */
export const generateThemeStyles = (theme = {}) => {
  // Default Theme Fallbacks
  const t = {
    primaryColor: theme.primaryColor || '#6366f1',
    backgroundColor: theme.backgroundColor || '#0a0a0b',
    textColor: theme.textColor || '#ffffff',
    secondaryColor: theme.secondaryColor || '#1e293b',
    accentColor: theme.accentColor || '#8b5cf6',
    
    // Typography
    fontFamily: theme.fontFamily || 'Inter',
    
    // Shapes (rounded, sharp, pill)
    borderRadius: theme.borderRadius || '1.5rem', // 24px default
    
    // Button Style (solid, outline, ghost)
    buttonStyle: theme.buttonStyle || 'solid',
    
    // Shadow Intensity (soft, medium, hard)
    shadowIntensity: theme.shadowIntensity || 'medium',

    // Motion & Animation
    animationStyle: theme.animationStyle || 'spring',
    progressStyle: theme.progressStyle || 'bar',
    layoutMode: theme.layoutMode || 'classic',
  };

  // Font Handling (Google Fonts)
  const fontUrl = getGoogleFontUrl(t.fontFamily);

  // Get shadow preset
  const shadowVars = getShadowPreset(t.shadowIntensity);
  
  // Get button style variables
  const buttonVars = getButtonStyleVars(t.buttonStyle, t.primaryColor, t.textColor);
  
  // Get shape/radius variables
  const shapeVars = getShapeVars(t.borderRadius);

  // CSS Variables Mapping
  const cssVariables = `
    /* Colors */
    --primary: ${t.primaryColor};
    --primary-rgb: ${hexToRgb(t.primaryColor)};
    --primary-dark: ${darkenColor(t.primaryColor, 10)};
    --primary-light: ${lightenColor(t.primaryColor, 10)};
    
    --bg-main: ${t.backgroundColor};
    --bg-main-rgb: ${hexToRgb(t.backgroundColor)};
    --bg-card: ${modifyOpacity(t.secondaryColor, 0.5)};
    --bg-card-rgb: ${hexToRgb(t.secondaryColor)};
    --bg-glass: rgba(255, 255, 255, 0.03);
    
    --text-main: ${t.textColor};
    --text-main-rgb: ${hexToRgb(t.textColor)};
    --text-muted: ${modifyOpacity(t.textColor, 0.6)};
    
    --secondary: ${t.secondaryColor};
    --secondary-rgb: ${hexToRgb(t.secondaryColor)};
    
    --accent: ${t.accentColor};
    --accent-rgb: ${hexToRgb(t.accentColor)};
    
    /* Typography */
    --font-main: '${t.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --font-weight-normal: 400;
    --font-weight-medium: 600;
    --font-weight-bold: 800;
    
    /* Shapes & Radius */
    ${shapeVars}
    
    /* Shadows */
    ${shadowVars}
    
    /* Button Styles */
    ${buttonVars}
    
    /* Borders */
    --border-subtle: rgba(255, 255, 255, 0.06);
    --border-medium: rgba(255, 255, 255, 0.12);

    /* Animation & Progress */
    --quiz-animation: ${getAnimationTransition(t.animationStyle)};
    --quiz-progress-style: '${t.progressStyle}';
  `;

  return {
    cssVariables,
    fontUrl,
    fontFamily: t.fontFamily
  };
};

/**
 * Generates Google Fonts URL with proper weights
 * @param {string} fontFamily - Font family name
 * @return {string} - Google Fonts URL
 */
export const getGoogleFontUrl = (fontFamily) => {
  const fontName = fontFamily.replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700;800;900&display=swap`;
};

/**
 * Returns shadow CSS variables based on intensity
 * @param {string} intensity - 'soft', 'medium', or 'hard'
 * @return {string} - CSS variables for shadows
 */
export const getShadowPreset = (intensity = 'medium') => {
  const presets = {
    soft: {
      card: '0 2px 8px rgba(0, 0, 0, 0.08)',
      btn: '0 4px 12px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(99, 102, 241, 0.2)',
    },
    medium: {
      card: '0 8px 24px rgba(0, 0, 0, 0.15)',
      btn: '0 4px 16px rgba(99, 102, 241, 0.4)',
      glow: '0 0 30px rgba(99, 102, 241, 0.3)',
    },
    hard: {
      card: '0 20px 50px rgba(0, 0, 0, 0.3)',
      btn: '0 8px 24px rgba(99, 102, 241, 0.5)',
      glow: '0 0 40px rgba(99, 102, 241, 0.5)',
    },
  };

  const preset = presets[intensity] || presets.medium;
  
  return `
    --shadow-card: ${preset.card};
    --shadow-btn: ${preset.btn};
    --shadow-glow: ${preset.glow};
  `;
};

/**
 * Returns button style CSS variables
 * @param {string} buttonStyle - 'solid', 'outline', or 'ghost'
 * @param {string} primaryColor - Primary color hex
 * @param {string} textColor - Text color hex
 * @return {string} - CSS variables for button styles
 */
export const getButtonStyleVars = (buttonStyle = 'solid', primaryColor = '#6366f1', textColor = '#ffffff') => {
  const styles = {
    solid: {
      bg: `linear-gradient(135deg, ${primaryColor} 0%, ${darkenColor(primaryColor, 10)} 100%)`,
      text: getContrastColor(primaryColor),
      border: 'transparent',
      borderWidth: '0px',
    },
    outline: {
      bg: 'transparent',
      text: primaryColor,
      border: primaryColor,
      borderWidth: '2px',
    },
    ghost: {
      bg: 'rgba(255, 255, 255, 0.05)',
      text: textColor,
      border: 'transparent',
      borderWidth: '0px',
    },
  };

  const style = styles[buttonStyle] || styles.solid;
  
  return `
    --btn-bg: ${style.bg};
    --btn-text: ${style.text};
    --btn-border: ${style.border};
    --btn-border-width: ${style.borderWidth};
  `;
};

/**
 * Returns shape/radius CSS variables
 * @param {string} borderRadius - Border radius value or preset ('rounded', 'sharp', 'pill')
 * @return {string} - CSS variables for shapes
 */
export const getShapeVars = (borderRadius = '1.5rem') => {
  // Handle presets
  const presets = {
    rounded: '1.5rem',
    sharp: '0.25rem',
    pill: '9999px',
  };

  const mainRadius = presets[borderRadius] || borderRadius;
  
  // Derive button and input radius from main radius
  const btnRadius = mainRadius === '9999px' ? '9999px' : 
                    mainRadius === '0.25rem' ? '0.25rem' : 
                    '0.75rem';
  
  const inputRadius = mainRadius === '9999px' ? '9999px' : 
                      mainRadius === '0.25rem' ? '0.25rem' : 
                      '1rem';

  return `
    --radius-main: ${mainRadius};
    --radius-btn: ${btnRadius};
    --radius-input: ${inputRadius};
  `;
};

/**
 * Helper to get the cubic-bezier string for a transition style
 */
const getAnimationTransition = (style) => {
  const styles = {
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear'
  };
  return styles[style] || styles.spring;
};

// ============================================
// Color Helper Functions
// ============================================

/**
 * Converts hex color to RGB format for CSS variables
 * @param {string} hex - Hex color code
 * @return {string} - RGB values as "r g b"
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '99, 102, 241'; // default indigo
};

/**
 * Modifies color opacity
 * @param {string} hex - Hex color code
 * @param {number} opacity - Opacity value (0-1)
 * @return {string} - RGBA color string
 */
export const modifyOpacity = (hex, opacity) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb}, ${opacity})`;
};

/**
 * Darkens a hex color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @return {string} - Darkened hex color
 */
export const darkenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max((num >> 8 & 0x00FF) - amt, 0);
  const B = Math.max((num & 0x0000FF) - amt, 0);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

/**
 * Lightens a hex color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @return {string} - Lightened hex color
 */
export const lightenColor = (hex, percent) => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min((num >> 16) + amt, 255);
  const G = Math.min((num >> 8 & 0x00FF) + amt, 255);
  const B = Math.min((num & 0x0000FF) + amt, 255);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
};

/**
 * Calculates the best contrast color (black or white) for a given background color
 * @param {string} hex - Hex color code
 * @return {string} - '#ffffff' or '#000000'
 */
export const getContrastColor = (hex) => {
  if (!hex) return '#ffffff';
  // If short hex (e.g. #000), expand it
  const fullHex = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
  
  const r = parseInt(fullHex.substr(1, 2), 16);
  const g = parseInt(fullHex.substr(3, 2), 16);
  const b = parseInt(fullHex.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};
