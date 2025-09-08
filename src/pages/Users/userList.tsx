/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../reduxKit/store";
import { adminGetUsers, deleteUserAction } from "../../reduxKit/actions/admin/userAdctions";
import Button from "../../components/ui/button/Button";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface User {
  _id: string; 
  name: string;
  phoneNumber: string;
  uniqueId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const resultAction = await dispatch(adminGetUsers());
        // If your API returns users in resultAction.payload.data
        const data = resultAction.payload?.data || resultAction.payload;
        setUsers(Array.isArray(data) ? data : []);
        console.log("adminGetUsers response:", data);
      } catch {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

    const handleDelete = async (userId: string) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      setLoading(true);
      try {
        const resultAction = await dispatch(deleteUserAction(userId));
        if (resultAction.meta.requestStatus === "fulfilled") {
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        } else {
          alert("Failed to delete user: " + (resultAction.payload?.message || "Unknown error"));
        }
      } catch (error) {
        alert("Error deleting user");
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow-lg">
        <span className="inline-flex items-center gap-2">
          <UserCircleIcon className="w-8 h-8 text-blue-500" />
          User List
        </span>
      </h2>
      {loading ? (
        <div className="text-center py-12 text-blue-600 font-semibold animate-pulse">Loading users...</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-blue-200 rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Unique ID</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-blue-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-blue-50">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50 transition-all duration-200">
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                        <UserCircleIcon className="w-7 h-7 text-blue-400 bg-blue-100 rounded-full shadow" />
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.phoneNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{user.uniqueId}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${user.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full px-4 py-2 shadow-md transition-all duration-150" onClick={() => handleDelete(user._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No users found.</div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCircleIcon className="w-10 h-10 text-blue-400 bg-blue-100 rounded-full shadow" />
                    <div>
                      <div className="font-bold text-lg text-blue-700">{user.name}</div>
                      <div className="text-xs text-gray-500">ID: {user.uniqueId}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Phone:</span>
                      <span className="text-gray-600">{user.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow ${user.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{user.status}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full px-4 py-2 shadow-md transition-all duration-150" onClick={() => handleDelete(user._id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
