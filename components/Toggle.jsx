export function Toggle({ label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 smooth-transition">
            <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</div>
            </div>
            <button
                type="button"
                className={`${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                onClick={() => onChange(!checked)}
            >
                <span
                    className={`${checked ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
}
