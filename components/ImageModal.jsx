import { useState, useEffect } from 'react';

export function ImageModal({ image, onClose }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (image) {
            setIsOpen(true);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            setIsOpen(false);
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [image]);

    if (!image || !isOpen) return null;

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const copyPrompt = () => {
        navigator.clipboard.writeText(image.prompt);
        alert('Prompt copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity opacity-100"
                onClick={handleClose}
            ></div>

            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                {/* Image Section */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-4 min-h-[300px]">
                    {image.url ? (
                        <img
                            src={image.url}
                            alt={image.prompt}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
                        />
                    ) : (
                        <div className="text-gray-400">No Image URL</div>
                    )}
                </div>

                {/* Details Section */}
                <div className="w-full md:w-96 p-6 flex flex-col border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Image Details</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prompt</label>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                                {image.prompt}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Niche</label>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{image.niche}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Style</label>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{image.style}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ratio</label>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{image.ratio || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {new Date(image.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Advanced Info if available */}
                        {(image.steps || image.cfg || image.sampler) && (
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="text-sm font-semibold mb-2">Generation Params</h4>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {image.steps && <div>Steps: {image.steps}</div>}
                                    {image.cfg && <div>CFG: {image.cfg}</div>}
                                    {image.sampler && <div>Sampler: {image.sampler}</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={copyPrompt}
                            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl font-medium transition-colors flex items-center justify-center"
                        >
                            <span className="mr-2">📋</span> Copy Prompt
                        </button>
                        {image.url && (
                            <a
                                href={image.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={`generated-${image.timestamp}.png`}
                                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
                            >
                                <span className="mr-2">⬇️</span> Download
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
