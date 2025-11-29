export function ImageGrid({ images, onImageClick, isLoading }) {
    if (isLoading && (!images || images.length === 0)) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No images generated yet.</p>
                <p className="text-sm">Start a batch to see results here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    onClick={() => onImageClick(img)}
                >
                    {img.url ? (
                        <img
                            src={img.url}
                            alt={img.prompt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800">
                            <span className="text-xs p-2 text-center">{img.error ? 'Failed' : 'Processing...'}</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-white text-xs line-clamp-2 font-medium">{img.prompt}</p>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-gray-300 bg-black/30 px-1.5 py-0.5 rounded">{img.niche}</span>
                            {img.error && <span className="text-[10px] text-red-300 bg-red-900/50 px-1.5 py-0.5 rounded">Error</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
