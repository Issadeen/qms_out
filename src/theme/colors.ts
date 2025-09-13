export const Colors = {
  // Light theme colors
  light: {
    // Primary brand colors (KPC Red Theme - Beautiful Deep Crimson)
    primary: '#DC143C',        // Beautiful KPC crimson red
    primaryLight: '#ffcdd2',
    primaryDark: '#B22222',    // Darker crimson for depth
    
    // Secondary colors (Complementary warm tones)
    secondary: '#ff5722',
    secondaryLight: '#ff8a65',
    secondaryDark: '#e64a19',
    
    // Neutral colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    
    // Text colors
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    textInverse: '#ffffff',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Status colors
    success: '#4caf50',
    successLight: '#81c784',
    warning: '#ff9800',
    warningLight: '#ffb74d',
    error: '#DC143C',          // Use KPC red for errors too
    errorLight: '#ffcdd2',
    info: '#2196f3',
    infoLight: '#64b5f6',
    
    // Glassmorphism
    glass: 'rgba(220, 20, 60, 0.1)',      // KPC red glassmorphism
    glassStrong: 'rgba(220, 20, 60, 0.2)',
    
    // Shadows
    shadow: 'rgba(220, 20, 60, 0.1)',     // KPC red shadows
    shadowStrong: 'rgba(220, 20, 60, 0.2)',
  },
  
  // Dark theme colors
  dark: {
    // Primary brand colors (KPC Red Theme - Dark Mode with Crimson Red)
    primary: '#DC143C',        // Keep the beautiful crimson red in dark mode!
    primaryLight: '#FF6B6B',   // Lighter red for highlights
    primaryDark: '#8B0000',    // Even darker crimson for depth
    
    // Secondary colors
    secondary: '#ff7043',
    secondaryLight: '#ff8a65',
    secondaryDark: '#ff5722',
    
    // Neutral colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    
    // Text colors
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textInverse: '#0f172a',
    
    // Border colors
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1e293b',
    
    // Status colors
    success: '#66bb6a',
    successLight: '#81c784',
    warning: '#ffb74d',
    warningLight: '#ffd54f',
    error: '#DC143C',          // Beautiful crimson red for errors
    errorLight: '#FF6B6B',
    info: '#42a5f5',
    infoLight: '#64b5f6',
    
    // Glassmorphism
    glass: 'rgba(220, 20, 60, 0.08)',     // Crimson red glassmorphism for dark mode
    glassStrong: 'rgba(220, 20, 60, 0.15)',
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowStrong: 'rgba(0, 0, 0, 0.5)',
  }
};

export const Gradients = {
  light: {
    primary: ['#DC143C', '#B22222'],      // Beautiful KPC red gradient
    secondary: ['#ff5722', '#ff3d00'],
    surface: ['#ffffff', '#f8fafc'],
    success: ['#4caf50', '#43a047'],
    error: ['#DC143C', '#B22222'],        // KPC red for errors
  },
  dark: {
    primary: ['#DC143C', '#8B0000'],      // Keep crimson red in dark mode too!
    secondary: ['#ff7043', '#ff3d00'],
    surface: ['#1e293b', '#334155'],
    success: ['#66bb6a', '#4caf50'],
    error: ['#DC143C', '#8B0000'],        // Crimson red for dark mode errors
  }
};

export type ColorTheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;