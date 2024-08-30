import React, { useState } from "react";
import * as yup from "yup";
import axiosInstance from "../../axiosConfig";
import { Link } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  inputFocus: {
    borderColor: "#007bff",
    outline: "none",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  },
  responseItem: {
    marginBottom: "20px",
  },
  answerLabel: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  content: {
    marginTop: "10px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
  },
};

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [formData, setFormData] = useState<Record<string, string>>({ qiz: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any[]>([]);

  const schema = yup.object().shape({
    qiz: yup.string().required("Qiz is required"),
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await schema.validate(formData);

      const response = await axiosInstance.get("/faqs/answers", {
        params: {
          faq: formData.qiz,
        },
      });
      setResponseData(response.data);
      setFormData({ qiz: "" });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(validationErrors);
      } else {
        console.error("Error fetching data:", error);
        setErrors({ general: "An error occurred while fetching data." }); // Generic error for non-validation issues
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>FAQs Chat</h2>

      {/* {userData ? (
        <div>
          <p>Welcome, {userData.name}!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )} */}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="qiz" style={styles.label}>
            Qiz Sample: "what is a deductible?"
          </label>
          <input
            type="text"
            id="qiz"
            name="qiz"
            value={formData.qiz}
            onChange={handleChange}
            placeholder="Enter Qiz"
            style={styles.input}
          />
          {errors.qiz && <p style={styles.errorMessage}>{errors.qiz}</p>}
        </div>
        <button type="submit" style={styles.button}>
          Ask
        </button>
      </form>
      {responseData.length > 0 && (
        <div>
          {responseData.map((item, index) => (
            <div key={index} className="response-item">
              <h1 className="answer-label">Answer {index + 1}</h1>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
        </div>
      )}
      {errors.general && <p style={styles.errorMessage}>{errors.general}</p>}

      <div className="nav-links">
        <nav>
          <Link to="/logout">Logout</Link>
        </nav>
      </div>

    </div>
  );
};

export default Dashboard;
