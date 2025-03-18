import React from "react";
export default function FormContainer({
    title,
    onSubmit,
    children,
    footerContent
  }) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {title && (
          <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        )}
        <form onSubmit={onSubmit}>
          {children}
          {footerContent && (
            <div className="text-center mt-4 text-gray-500">
              {footerContent}
            </div>
          )}
        </form>
      </div>
    );
  }
  