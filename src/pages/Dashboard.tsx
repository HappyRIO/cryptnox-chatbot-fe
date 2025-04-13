import { useState, useEffect } from "react";
import {
  Trash2,
  Edit2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
} from "lucide-react";
// , ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify"; // Import toast notification
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import type { ChatData } from "../types";

const Dashboard = () => {
  const [data, setData] = useState<ChatData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ChatData | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats`,
        {
          method: "POST",
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
      const result = await response.json();
      setData([...result].reverse());
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result) {
        setData(data.filter((item) => item.id !== id));
        toast.success("Chat deleted successfully!"); // Success notification
      } else {
        toast.error("Failed to delete chat!"); // Error notification
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete chat!"); // Error notification
    }
  };

  const handleEdit = (chat: ChatData) => {
    setEditingId(chat.id);
    setEditForm(chat);
  };

  const handleSave = async () => {
    if (!editForm) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${editForm.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bot: editForm.bot }),
        }
      );
      const result = await response.json();
      if (result) {
        setData(
          data.map((item) =>
            item.id === editForm.id ? { ...editForm, edited: 1 } : item
          )
        );
        setEditingId(null);
        setEditForm(null);
        toast.success("Chat updated successfully!"); // Success notification
      } else {
        toast.error("Failed to update chat!"); // Error notification
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update chat!"); // Error notification
    }
  };

  const paginatedData = data.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="h-full w-screen min-h-screen mx-auto px-4 py-8 bg-white text-black">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Conversation History
      </h1>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 bg-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <p>per page</p>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-4">
          {/* First Page */}
          <button
            disabled={page === 1}
            onClick={() => setPage(1)}
            className={`px-3 py-2 rounded-md transition ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronsLeft />
          </button>

          {/* Previous Page */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-2 rounded-md transition ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronLeft />
          </button>

          {/* Page Indicator */}
          <span className="px-4 py-2 bg-gray-100 border rounded-md text-gray-700 font-medium">
            Page {page} / {Math.ceil(data.length / itemsPerPage)}
          </span>

          {/* Next Page */}
          <button
            disabled={page * itemsPerPage >= data.length}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-2 rounded-md transition ${
              page * itemsPerPage >= data.length
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronRight />
          </button>

          {/* Last Page */}
          <button
            disabled={page * itemsPerPage >= data.length}
            onClick={() => setPage(Math.ceil(data.length / itemsPerPage))}
            className={`px-3 py-2 rounded-md transition ${
              page * itemsPerPage >= data.length
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <ChevronsRight />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-6 px-4 py-3">ID</th>
                <th className="w-40 px-4 py-3">ChatID</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Bot</th>
                <th className="w-8 px-6 py-3">Edited</th>
                <th className="w-32 px-4 py-3">Time</th>
                <th className="w-24 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((chat) => (
                <tr
                  key={chat.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4">{chat.id}</td>
                  <td className="px-2 py-4 w-40 text-nowrap">{chat.chatid}</td>
                  <td className="px-6 py-4">{chat.user}</td>
                  <td className="px-6 py-4">
                    {editingId === chat.id ? (
                      <textarea
                        value={editForm?.bot || ""}
                        onChange={(e) =>
                          setEditForm((prev) =>
                            prev ? { ...prev, bot: e.target.value } : null
                          )
                        }
                        className="w-full border rounded px-2 py-1 min-h-[60px] bg-white"
                      />
                    ) : (
                      <ReactMarkdown>{chat.bot}</ReactMarkdown>
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    {chat.edited == 1 && <Check />}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(chat.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2 justify-center">
                      {editingId === chat.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 bg-white"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="text-gray-600 hover:text-gray-900 bg-white"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(chat)}
                            className="text-blue-600 hover:text-blue-900 bg-white"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(chat.id)}
                            className="text-red-600 hover:text-red-900 bg-white"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
