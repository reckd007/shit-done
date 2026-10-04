import { useState, useEffect } from 'react';
import { ThemeMode } from '../types/medicine';

export function useTheme(themeMode: ThemeMode, onThemeChange?: (mode: ThemeMode) => void) {
  // Check system preference
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to system changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };

    // Modern and fallback event listeners
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy browsers
      (mediaQuery as unknown as { addListener: (cb: typeof handleChange) => void }).addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        (mediaQuery as unknown as { removeListener: (cb: typeof handleChange) => void }).removeListener(handleChange);
      }
    };
  }, []);

  const isDark = themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';

  // Apply dark class and theme-color meta tag to document element
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Update meta theme-color for Android/mobile browser chrome
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#0f172a' : '#0284c7');
    }
  }, [isDark]);

  const cycleTheme = () => {
    if (!onThemeChange) return;
    // Cycle: system -> dark -> light -> system
    if (themeMode === 'system') {
      onThemeChange('dark');
    } else if (themeMode === 'dark') {
      onThemeChange('light');
    } else {
      onThemeChange('system');
    }
  };

  return {
    isDark,
    systemPrefersDark,
    themeMode,
    cycleTheme,
  };
}
