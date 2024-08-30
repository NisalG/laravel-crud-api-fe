import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosConfig";

interface RegisterFormProps {}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const RegisterForm: React.FC<RegisterFormProps> = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await schema.validate(formData);

      const response = await axiosInstance.post(
        "/register",
        formData
      );
      // Handle successful registration (e.g., redirect, display success message)
      console.log("Registration successful:", response.data);
      localStorage.setItem("authToken", response.data.token);   // Store the token in localStorage
      setErrors({
        general: "Registration successful.",
      });
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(validationErrors);
      } else {
        console.error("Registration error:", error);
        setErrors({
          general: "An unexpected error occurred during registration.",
        }); // Generic error for non-validation issues
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
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
        {errors.email && <p className="error-message">{errors.email}</p>}
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
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password_confirmation">Confirm Password</label>
        <input
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
        {errors.password_confirmation && (
          <p className="error-message">{errors.password_confirmation}</p>
        )}
      </div>
      {errors.general && <p className="error-message">{errors.general}</p>}
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
