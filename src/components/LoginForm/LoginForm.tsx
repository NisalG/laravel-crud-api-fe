import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

interface LoginFormProps {}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });

      const response = await axiosInstance.post(
        "/login",
        formData
      );

      // Handle successful login (e.g., store token, redirect)
      console.log("Login successful:", response.data);
      localStorage.setItem("authToken", response.data.token);   // Store the token in localStorage
      setError("Login successful.");
      navigate("/dashboard");
    } catch (error) {
      // Handle validation or login errors
      if (error instanceof yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setError(Object.values(validationErrors).join("\n")); // Combine error messages
      } else {
        console.error("Login error:", error);
        setError("An error occurred during login."); // Generic error for non-validation issues
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
        />
        {error && error.includes("email") && (
          <p className="error-message">{error}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
        {error && error.includes("password") && (
          <p className="error-message">{error}</p>
        )}
      </div>
      {error && !error.includes("email") && !error.includes("password") && (
        <p className="error-message">{error}</p>
      )}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
