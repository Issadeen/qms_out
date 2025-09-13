import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import { Colors, ColorTheme, ThemeColors } from './colors';
import { Typography, Spacing, BorderRadius, Shadows, Animations } from './tokens';

interface ThemeContextType {
  theme: ColorTheme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  animations: typeof Animations;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    // Initialize based on system preference
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  const colors = Colors[theme];

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    isDark,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    animations: Animations,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for creating themed styles
export function useThemedStyles<T>(
  createStyles: (theme: ThemeContextType) => T
): T {
  const theme = useTheme();
  return createStyles(theme);
}