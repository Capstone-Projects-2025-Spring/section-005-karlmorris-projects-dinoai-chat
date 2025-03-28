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
        })
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (response.ok && data.success) {
        console.log("✅ Login successful");
        
        localStorage.setItem('token', data.token);
        
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          username: data.username,
          email: data.email,
          learningLanguage: data.learningLanguage,
          nativeLanguage: data.nativeLanguage
        }));
        
        navigate("/"); 
      } else {
        setErrors({ general: data.message || "Invalid email or password" });
      }

    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const footerContent = (
      <div className="flex flex-col">
        <Link to="/" className="text-gray-500 hover:underline">
          Home Page
        </Link>
        <Link to="/signup" className="text-gray-500 hover:underline">
          Or sign up
        </Link>
      </div>
  );

  console.log("loginBg path:", loginBg);

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
