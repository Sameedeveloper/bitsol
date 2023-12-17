import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: { email: string; password: string },
    actions: any
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        values
      );
      localStorage.setItem("accessToken", response.data.access_token);
      navigate("/users");
    } catch (error) {
      console.error("Login error:", error);
      window.alert("Incorrect Credentials or Non-admin user")
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <Field
              type="email"
              name="email"
              className="w-full p-2 border rounded"
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            {isSubmitting ? <Spinner /> : "Log In"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
