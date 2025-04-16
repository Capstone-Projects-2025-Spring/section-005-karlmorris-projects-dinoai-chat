import React from "react";
import { render, screen } from "@testing-library/react";
import ChatWindow from "../components/ChatWindow";

const messages = [
  { id: 1, content: "User message", isUser: true },
  {
    id: 2,
    content: "AI message",
    isUser: false,
    feedbackAlertType: "error",
    corrections: ["Fix this sentence."],
  },
];

describe("ChatWindow", () => {
  it("renders all messages", () => {
    render(<ChatWindow messages={messages} />);
    expect(screen.getByText("User message")).toBeInTheDocument();
    expect(screen.getByText("AI message")).toBeInTheDocument();
  });

  it("shows feedback alert for AI message", () => {
    render(<ChatWindow messages={messages} />);
    expect(screen.getByText(/grammar\/spelling issues/i)).toBeInTheDocument();
    expect(screen.getByText("Fix this sentence.")).toBeInTheDocument();
  });
});
