import React, { useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const createUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  addresses: Yup.array().of(
    Yup.object().shape({
      addressLine1: Yup.string().required("Address Line 1 is required"),
      addressLine2: Yup.string(),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
    })
  ),
  role: Yup.string(),
  phoneNo: Yup.string(),
});
const CreateUserPage: React.FC = () => {
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });
  const navigate = useNavigate();
  const viewUserDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };
  const handleSubmit = async (values: any, actions: any) => {
    try {
      const response = await axios.post("http://localhost:3000/users", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      viewUserDetails(response?.data?._id);
      actions.setSubmitting(false);
      actions.resetForm();
    } catch (error) {
      console.error("Error creating user:", error);
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg my-8 w-1/3">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          addresses: [
            {
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              country: "",
            },
          ],
          role: "",
          phoneNo: "",
        }}
        validationSchema={createUserSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="flex flex-col items-center space-y-4">
            <label className="font-semibold text-lg">Name *</label>

            <Field
              name="name"
              type="text"
              placeholder="Name"
              className="p-2 border rounded w-1/2"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
            <label className="font-semibold text-lg">Email *</label>

            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="p-2 border rounded w-1/2"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
            <label className="font-semibold text-lg">Password *</label>

            <Field
              name="password"
              type="password"
              placeholder="Password"
              className="p-2 border rounded w-1/2"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
            <label className="font-semibold text-lg">Address *</label>

            <FieldArray name="addresses">
              {({ insert, remove, push }) => (
                <div className="w-1/2">
                  {values.addresses.length > 0 &&
                    values.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center w-full"
                      >
                        <Field
                          name={`addresses[${index}].addressLine1`}
                          placeholder="Address Line 1"
                          className="p-2 border rounded w-full"
                        />
                        <ErrorMessage
                          name={`addresses[${index}].addressLine1`}
                          component="div"
                          className="text-red-500 text-sm"
                        />

                        <Field
                          name={`addresses[${index}].addressLine2`}
                          placeholder="Address Line 2"
                          className="p-2 border rounded w-full"
                        />
                        <Field
                          name={`addresses[${index}].city`}
                          placeholder="City"
                          className="p-2 border rounded w-full"
                        />
                        <Field
                          name={`addresses[${index}].state`}
                          placeholder="State"
                          className="p-2 border rounded w-full"
                        />
                        <Field
                          name={`addresses[${index}].country`}
                          placeholder="Country"
                          className="p-2 border rounded w-full"
                        />
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
            <label className="font-semibold text-lg">Role</label>

            <Field
              name="role"
              type="text"
              placeholder="Role"
              className="p-2 border rounded w-1/2"
            />
            <label className="font-semibold text-lg">Phone Number</label>

            <Field
              name="phoneNo"
              type="text"
              placeholder="Phone Number"
              className="p-2 border rounded w-1/2"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-1/2"
            >
              {isSubmitting ? <Spinner /> : "Create User"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUserPage;
