import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Loading from "../components/Loading";
import Spinner from "../components/Spinner";

const userSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
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

const EditUserPage: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      await axios.put(`http://localhost:3000/users/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loading />
      </div>
    );
  }
  return (
    <div className="container mx-auto bg-white rounded-lg w-1/3 my-8 p-8">
      <h1 className="text-2xl font-bold mb-4">Update User</h1>
      <Formik
        initialValues={user}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values }) => (
          <Form className="space-y-4 flex flex-col items-center">
            <label className="font-semibold text-lg">Name</label>
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
            <label className="font-semibold text-lg">Email</label>
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
            <label className="font-semibold text-lg">Address</label>
            <FieldArray name="addresses">
              {({ insert, remove, push }) => (
                <div className="w-1/2">
                  {values.addresses.length > 0 &&
                    values.addresses.map((address: any, index: number) => (
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
            />{" "}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-1/2"
            >
              {isSubmitting ? <Spinner /> : "Update User"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUserPage;
