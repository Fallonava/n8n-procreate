export function ImageGrid({ images, onImageClick, isLoading }) {
    if (isLoading && images.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg"
                    onClick={() => onImageClick(img)}
                >
                    <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Status Badge */}
                    {img.error && (
                        <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                            Failed
                        </div>
                    )}

                    {/* Info Badge */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-medium truncate">{img.niche}</p>
                        <p className="text-white/80 text-[10px] truncate">{new Date(img.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
