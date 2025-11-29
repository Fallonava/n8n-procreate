export function ImageGrid({ images, onImageClick, isLoading }) {
    if (isLoading && images.length === 0) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-shimmer"></div>
                ))}
            </div>
        );
    }

    if (images.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="group relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    onClick={() => onImageClick(img)}
                >
                    <img
                        src={img.url}
                        alt={img.prompt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Status Badge */}
                    {img.error && (
                        <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm animate-fade-in">
                            Failed
                        </div>
                    )}

                    {/* Info Badge */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-medium truncate capitalize">{img.niche}</p>
                        <p className="text-white/80 text-[10px] truncate">{new Date(img.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
