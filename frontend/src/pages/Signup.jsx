import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Signup form submitted", formData);
      // Handle signup logic here
      navigate("/dashboard"); // Redirect after successful signup
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative z-10">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold text-center mb-6">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                className="w-full p-2 border rounded border-gray-300"
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              {errors.fullName && (
                <p role="alert" aria-label="full name is required" className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-2 border rounded border-gray-300"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && (
                <p role="alert" aria-label="email is required" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-2 border rounded border-gray-300"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && (
                <p role="alert" aria-label="password is required" className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <button className="py-2 font-medium rounded-lg transition bg-blue-500 text-white hover:bg-blue-700 w-full" type="submit">
              Create Account
            </button>

            <div className="text-center mt-4 text-gray-500">
              <p className="text-center text-gray-500">
                Already have an account?{" "}
                <a className="text-blue-600 hover:underline" href="/login">
                  Log in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;