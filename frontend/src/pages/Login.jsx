import React from "react"; 
import { useState } from "react";
import { Link } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import FormContainer from "../components/FormContainer";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import loginBg from "../assets/LoginBackground2.jpg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // TODO: Handle login logic here
    console.log("Login form submitted", formData);
  };

  const footerContent = (
    <Link to="/Signup" className="text-gray-500 hover:underline">
      Or sign up
    </Link>
  );

  return (
    <PageBackground backgroundImage={loginBg}>
      <FormContainer 
        title="Login" 
        onSubmit={handleSubmit}
        footerContent={footerContent}
      >
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={errors.email}
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
        />
        
        <Button type="submit" fullWidth variant="primary">
          Login
        </Button>
      </FormContainer>
    </PageBackground>
  );
}