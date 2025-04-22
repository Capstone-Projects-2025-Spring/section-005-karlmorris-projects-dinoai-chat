import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import FormContainer from "../components/FormContainer";
import loginBg from "../assets/LoginBackground2.jpg"
import FormInput from "../components/FormInput";
import Button from "../components/Button";

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        learningLanguage: "en",
        nativeLanguage: "en"  
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    // Define Gemini-supported languages
    const supportedLanguages = [
      { code: "ar", name: "Arabic" },
      { code: "bn", name: "Bengali" },
      { code: "bg", name: "Bulgarian" },
      { code: "zh", name: "Chinese (Simplified & Traditional)" },
      { code: "hr", name: "Croatian" },
      { code: "cs", name: "Czech" },
      { code: "da", name: "Danish" },
      { code: "nl", name: "Dutch" },
      { code: "en", name: "English" },
      { code: "et", name: "Estonian" },
      { code: "fi", name: "Finnish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "el", name: "Greek" },
      { code: "gu", name: "Gujarati" },
      { code: "he", name: "Hebrew" },
      { code: "hi", name: "Hindi" },
      { code: "hu", name: "Hungarian" },
      { code: "id", name: "Indonesian" },
      { code: "it", name: "Italian" },
      { code: "ja", name: "Japanese" },
      { code: "kn", name: "Kannada" },
      { code: "ko", name: "Korean" },
      { code: "lv", name: "Latvian" },
      { code: "lt", name: "Lithuanian" },
      { code: "ms", name: "Malay" },
      { code: "ml", name: "Malayalam" },
      { code: "mr", name: "Marathi" },
      { code: "no", name: "Norwegian" },
      { code: "pl", name: "Polish" },
      { code: "pt", name: "Portuguese" },
      { code: "ro", name: "Romanian" },
      { code: "ru", name: "Russian" },
      { code: "sr", name: "Serbian" },
      { code: "sk", name: "Slovak" },
      { code: "sl", name: "Slovenian" },
      { code: "es", name: "Spanish" },
      { code: "sw", name: "Swahili" },
      { code: "sv", name: "Swedish" },
      { code: "ta", name: "Tamil" },
      { code: "te", name: "Telugu" },
      { code: "th", name: "Thai" },
      { code: "tr", name: "Turkish" },
      { code: "uk", name: "Ukrainian" },
      { code: "ur", name: "Urdu" },
      { code: "vi", name: "Vietnamese" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Form validation
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!supportedLanguages.find(lang => lang.code === formData.nativeLanguage)) {
            newErrors.nativeLanguage = "Please select a valid native language.";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("✅ Signup successful", data);

                // Automatically log the user in
                const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok && loginData.token) {
                    // Store the JWT token and user info in localStorage
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('user', JSON.stringify({
                        userId: loginData.userId,
                        username: loginData.username,
                        email: loginData.email,
                        learningLanguage: loginData.learningLanguage,
                        nativeLanguage: loginData.nativeLanguage
                    }));

                    // Redirect to home page or dashboard
                    navigate("/");
                } else {
                    // If auto-login fails, redirect to login page
                    navigate("/login", { state: { message: "Account created! Please login." } });
                }
            } else {
                // Handle signup errors
                if (data.message) {
                    if (data.message.includes("email")) {
                        setErrors({ email: data.message });
                    } else if (data.message.includes("username")) {
                        setErrors({ username: data.message });
                    } else {
                        setErrors({ general: data.message });
                    }
                } else {
                    setErrors({ general: "Signup failed. Please try again." });
                }
            }
        } catch (error) {
            console.error("Error during signup:", error);
            setErrors({ general: "Network error. Please check your connection and try again." });
        } finally {
            setIsLoading(false);
        }
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
        <PageBackground backgroundImage={loginBg}>
            <FormContainer
                title="Create Account"
                onSubmit={handleSubmit}
                footerContent={footerContent}
            >
                <FormInput
                    label="Username"
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    error={errors.username}
                    disabled={isLoading}
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

                <div className="mb-4">
                        <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700">Native Language</label>
                        <select
                            id="nativeLanguage"
                            name="nativeLanguage"
                            value={formData.nativeLanguage}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            disabled={isLoading}
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                        {errors.nativeLanguage && <p className="mt-1 text-sm text-red-600">{errors.nativeLanguage}</p>}
                </div>

                {errors.general && (
                    <div className="text-red-500 text-sm mt-2">{errors.general}</div>
                )}

                <Button type="submit" fullWidth variant="black" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </FormContainer>
        </PageBackground>
    );
}