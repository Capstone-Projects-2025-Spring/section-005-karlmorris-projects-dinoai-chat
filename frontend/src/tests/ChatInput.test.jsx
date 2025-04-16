import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ChatInput from "../components/ChatInput";

describe("ChatInput", () => {
  it("calls onInputSubmit when enter is pressed", () => {
    const mockSubmit = jest.fn(() => Promise.resolve());
    render(<ChatInput onInputSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Type here...");
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockSubmit).toHaveBeenCalledWith("Test message");
  });

  it("clears input after submitting", async () => {
    const mockSubmit = jest.fn(() => Promise.resolve());
    render(<ChatInput onInputSubmit={mockSubmit} />);

    const input = screen.getByPlaceholderText("Type here...");
    fireEvent.change(input, { target: { value: "Test" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    });

    expect(mockSubmit).toHaveBeenCalledWith("Test");
    expect(input.value).toBe("");
  });
});
