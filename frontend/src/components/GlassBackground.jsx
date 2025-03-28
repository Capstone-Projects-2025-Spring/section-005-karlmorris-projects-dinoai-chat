export default function GlassBackground({ children }) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-transparent">

            <div className="absolute skew-12 top-10 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -skew-6 bottom-16 right-32 w-96 h-96 bg-blue-400/30 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="absolute top-1/3 left-1/2 w-60 h-60 bg-violet-300/20 rotate-45 rounded-xl blur-3xl"></div>

            <div className="absolute inset-0 backdrop-blur-md bg-white/5" />

            <div className="relative z-10">
                {children}
            </div>

        </div>
    );
}
