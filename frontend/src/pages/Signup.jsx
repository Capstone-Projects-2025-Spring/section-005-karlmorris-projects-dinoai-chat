import React from "react"; 
import { useState } from "react";
import { Link } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import FormContainer from "../components/FormContainer";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import loginBg from "../assets/LoginBackground2.jpg";

export default function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
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


        const newErrors = {};
        if (!formData.fullName) newErrors.fullName = "Full Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        console.log("Sign-up form submitted", formData);
    };

    const footerContent = (
        <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
                Log in
            </Link>
        </p>
    );

    return (
        <PageBackground backgroundImage={loginBg} >
            <FormContainer
                title="Create Account"
                onSubmit={handleSubmit}
                footerContent={footerContent}
            >
                <FormInput
                    label="Full Name"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    error={errors.fullName}
                />

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

                <Button type="submit" fullWidth variant="black">
                    Create Account
                </Button>
            </FormContainer>
        </PageBackground>
    );
}