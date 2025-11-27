import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700"
      aria-label="Toggle theme"
    >
      <span
        className={`${
          isDark ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-gray-300`}
      >
        <span className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity">
          {isDark ? (
            <span className="text-xs">🌙</span>
          ) : (
            <span className="text-xs">☀️</span>
          )}
        </span>
      </span>
    </button>
  );
}