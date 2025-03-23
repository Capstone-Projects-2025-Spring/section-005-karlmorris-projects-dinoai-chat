import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginBg from "../assets/LoginBackground2.jpg";
import Button from "../components/Button";
import FormContainer from "../components/FormContainer";
import FormInput from "../components/FormInput";
import PageBackground from "../components/PageBackground";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending:", formData);
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
        credentials: "include"
      });

      const result = await response.text();
      console.log("Response:", response.status, result);

      if (response.ok && result === "Login successful") {
        console.log("✅ Login successful");
        navigate("/"); // or /dashboard, depending on your app
      } else {
        setErrors({ general: result || "Invalid email or password" });
      }

    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const footerContent = (
    <Link to="/Signup" className="text-gray-500 hover:underline">
      Or sign up
    </Link>
  );

  return (
    <PageBackground backgroundImage={loginBg}>
      <FormContainer title="Login" onSubmit={handleSubmit} footerContent={footerContent}>
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
          disabled={isLoading}
        />
        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={errors.password}
          disabled={isLoading}
        />
        <Button type="submit" fullWidth variant="primary" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        {errors.general && <div className="text-red-500 text-sm mt-2">{errors.general}</div>}
      </FormContainer>
    </PageBackground>
  );
}
