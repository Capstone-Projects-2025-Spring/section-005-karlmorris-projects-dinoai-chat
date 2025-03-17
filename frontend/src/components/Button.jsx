export default function Button({ 
    type = "button", 
    fullWidth = false, 
    variant = "primary", 
    children, 
    onClick,
    className = ""
  }) {
    const baseClasses = "py-2 font-medium rounded-lg transition";
    
    // Different variants
    const variants = {
      primary: "bg-blue-500 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-black hover:bg-gray-300",
      outline: "border border-blue-500 text-blue-500 hover:bg-blue-50"
    };
    
    // Width classes
    const widthClasses = fullWidth ? "w-full" : "";
    
    return (
      <button
        type={type}
        onClick={onClick}
        className={`${baseClasses} ${variants[variant] || variants.primary} ${widthClasses} ${className}`}
      >
        {children}
      </button>
    );
  }
  