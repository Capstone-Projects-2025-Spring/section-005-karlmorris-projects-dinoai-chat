import { useState } from "react";
import ToolTip from "./ToolTip";

export default function ChatInput({ onInputSubmit }) {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = () => {
        if (!input.trim()) return;

        setIsSending(true);
        onInputSubmit(input)
        .finally(() => {
            setIsSending(false);
        });
        
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
        handleSubmit();
        }
    };

    return (
        <div className="flex items-center gap-2 w-full">
            <input
                type="text"
                className="bg-white flex-1 border rounded-lg px-4 py-3 focus:outline-none"
                placeholder="Type here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <ToolTip text="Send Message" position="top">
                <button
                    className={`bg-white btn btn-outline h-auto px-4 py-3 hover:bg-gray-100 rounded-lg ${isSending ? "btn-disabled" : ""}`}
                    onClick={handleSubmit}
                    disabled={isSending}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                        />
                    </svg>
                </button>
            </ToolTip>

            <ToolTip text="End Conversation" position="top">
                <button
                    className={`bg-red-400 btn btn-outline h-auto px-4 py-3 hover:bg-red-500 rounded-lg ${isSending ? "btn-disabled" : ""}`}
                    disabled={isSending}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
                    </svg>
                </button>
            </ToolTip>
        </div>
    );
}
