import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Signup from "../pages/Signup";

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
};

test("renders signup form inputs and button", () => {
  renderComponent();
  expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
});

test("shows validation errors when submitting empty form", async () => {
  renderComponent();
  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await waitFor(() => {
    expect(screen.getByRole("alert", { name: /full name is required/i })).toBeInTheDocument();
    expect(screen.getByRole("alert", { name: /email is required/i })).toBeInTheDocument();
    expect(screen.getByRole("alert", { name: /password is required/i })).toBeInTheDocument();
  });
});

test("submits form with valid data", async () => {
  renderComponent();
  const consoleSpy = vi.spyOn(console, "log");

  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

  fireEvent.click(screen.getByRole("button", { name: /create account/i }));

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith("Signup form submitted", {
      fullName: "John Doe",
      email: "test@example.com",
      password: "password123",
    });
  });

  consoleSpy.mockRestore();
});