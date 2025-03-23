export default function ToolTip({ text, position = "right", children }) {
    return (
        <div className={`tooltip tooltip-${position}`}>
            <div className="tooltip-content">
                <div>{text}</div>
            </div>
            {children}
        </div>
    );
}