import React, { useState, useEffect } from "react";
import axios from "axios";
import { AutoSizer, List } from "react-virtualized";
//@ts-ignore
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
//move all interface into separate file later
export interface User {
  _id: string;
  name: string;
  email: string;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [refetch, setRefetch] = useState<boolean>(false);
  const limit = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const viewUserDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleCreateUser = () => {
    navigate("/create-user");
  };

  const handleEditUser = (userId: string) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDeleteUser = async (id: string) => {
    if (
      window.confirm(`Are you sure you want to delete this user [ID : ${id} ]?`)
    ) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRefetch(!refetch);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/users?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setUsers((prev) => [...prev, ...response.data.data]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page, refetch]);

  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 p-2 border-b border-gray-200 font-bold">
      <div className="col-span-4">ID</div>
      <div className="col-span-2">Name</div>
      <div className="col-span-4">Email</div>
      <div className="col-span-2">Actions</div>
    </div>
  );

  const rowRenderer = ({
    key,
    index,
    style,
  }: {
    key: string;
    index: number;
    style: React.CSSProperties;
  }) => {
    const user = users[index];
    return (
      <div
        key={key}
        style={style}
        className="grid grid-cols-12 gap-4 items-center p-2 border-b border-gray-200"
      >
        <div className="col-span-4">{user?._id}</div>
        <div className="col-span-2">{user?.name}</div>
        <div className="col-span-4">{user?.email}</div>
        <div className="flex space-x-2  col-span-2">
          <EyeIcon
            className="h-5 w-5 text-blue-500 cursor-pointer"
            onClick={() => viewUserDetails(user._id)}
          />
          <PencilIcon
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={() => handleEditUser(user._id)}
          />
          <TrashIcon
            className="h-5 w-5 text-red-500 cursor-pointer"
            onClick={() => handleDeleteUser(user._id)}
          />
        </div>
      </div>
    );
  };

  const handleScroll = ({
    clientHeight,
    scrollHeight,
    scrollTop,
  }: {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
  }) => {
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div
      className="m-8 bg-white p-4 rounded-md shadow-xl flex-col items-start"
      style={{ height: "90vh" }}
    >
      <div className="flex justify-between items-center px-8">
        <h1 className="font-bold text-2xl">Users</h1>
        <button
          onClick={handleCreateUser}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create User
        </button>
      </div>{" "}
      <div className="container mx-auto p-4" style={{ height: "80%" }}>
        <TableHeader />{" "}
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              rowCount={users.length}
              rowHeight={50}
              rowRenderer={rowRenderer}
              width={width}
              onScroll={handleScroll}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};

export default UserListPage;
