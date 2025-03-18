import React from "react";
export default function PageBackground({
  backgroundImage,
  children,
  overlayOpacity = 50
}) {
  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gray-900 opacity-${overlayOpacity}`}></div>
      </div>

      {/* Content (Above Background) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}