import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { User } from "./UserListPage";
import placeholderProfilePic from '../../src/assets/placeholder.png'; 
import Loading from "../components/Loading";

interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
  }

  interface UserExtended extends User {
    addresses: Address[];
    role: string;
    phoneNo: string;
  }

const UserDetailPage: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserExtended | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  if (!user) {
    return <div className="flex justify-center items-center w-full h-full"><Loading/></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto my-20">
    <div className="flex items-center space-x-4 mb-6">
      <img
        src={placeholderProfilePic}
        alt="Profile"
        className="h-24 w-24 rounded-full border-2 border-gray-300"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      <p>Phone: {user.phoneNo}</p>
      <p>Email: {user.email}</p>

      <h3 className="text-lg font-semibold">Address</h3>
      {user.addresses.map((address, index) => (
        <div key={index} className="pl-4 border-l-2 border-gray-200">
          <p>{address.addressLine1}</p>
          <p>{address.addressLine2}</p>
          <p>{address.city}, {address.state}</p>
          <p>{address.country}</p>
        </div>
      ))}

      <h3 className="text-lg font-semibold">Role</h3>
      <p>{user.role.toLocaleUpperCase()}</p>
    </div>
  </div>
  );
};

export default UserDetailPage;
