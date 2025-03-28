export default function PageBackground({ backgroundImage, children }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {/* Background Image + Overlay */}
            <div className="absolute top-0 left-0 w-full h-full z-0">
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                    }}
                />
                <div className="absolute inset-0 bg-gray-900 opacity-60" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
