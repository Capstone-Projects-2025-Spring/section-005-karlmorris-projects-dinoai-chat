import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

test("shows validation errors when submitting empty form", async () => {
  renderComponent();
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByRole("alert", { name: /email is required/i })).toBeInTheDocument();
    expect(screen.getByRole("alert", { name: /password is required/i })).toBeInTheDocument();
  });
});