import { useState } from "react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex">
            <div className="hidden md:block w-64 min-h-screen bg-gray-100 p-4">
                <SidebarContent />
            </div>

            <button
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded-lg shadow"
                onClick={() => setIsOpen(true)}
            >
                ☰
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>

                    <div className="w-64 min-h-screen bg-white shadow-lg p-4 relative z-50">
                        <button
                            className="absolute top-4 right-4 text-gray-500"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}
        </div>
    );
}

// ✅ Sidebar 具体内容（抽离成组件，代码更简洁）
function SidebarContent() {
    return (
        <ul className="space-y-4">
            <li className="font-semibold text-lg">Chat History</li>
            <li className="p-2">Recent Chat 1</li>
            <li className="p-2">Recent Chat 2</li>
            <li className="p-2">Recent Chat 3</li>
        </ul>
    );
}





