import React from "react";
import { render, screen } from "@testing-library/react";
import ChatBubble from "../components/ChatBubble";

describe("ChatBubble", () => {
  it("renders user message with correct class", () => {
    render(<ChatBubble message="Hello!" isUser={true} />);
    const bubble = screen.getByText("Hello!");
    expect(bubble).toBeInTheDocument();
    expect(bubble.parentElement).toHaveClass("chat-end");
  });

  it("renders AI message with correct class", () => {
    render(<ChatBubble message="Hi there!" isUser={false} />);
    const bubble = screen.getByText("Hi there!");
    expect(bubble.parentElement).toHaveClass("chat-start");
  });
});
