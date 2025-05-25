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
  Sun,
  Moon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type { ChatData } from "../types";
import AdminSidebar from "../components/AdminSidebar";

const Dashboard = () => {
  // Initialize dark mode based on system preference or saved setting
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [showEditedOnly, setShowEditedOnly] = useState(false);
  const [data, setData] = useState<ChatData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ChatData | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Handle dark mode toggle and persist to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

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
        toast.success("Chat deleted successfully!");
      } else {
        toast.error("Failed to delete chat!");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete chat!");
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
        toast.success("Chat updated successfully!");
      } else {
        toast.error("Failed to update chat!");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Failed to update chat!");
    }
  };

  // Filter data based on showEditedOnly flag
  const filteredData = showEditedOnly
    ? data.filter((chat) => chat.edited === 1)
    : data;

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="flex overflow-auto w-screen min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <AdminSidebar />

      <div className="flex-1 h-full min-h-screen ml-52 px-4 py-8 bg-white dark:bg-gray-800 text-black dark:text-white">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Conversation History
        </h1>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors hidden"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-700" />
            )}
          </button>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showEditedOnly}
              onChange={(e) => {
                setShowEditedOnly(e.target.checked);
                setPage(1); // Reset to first page when filter changes
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-gray-700 dark:text-gray-200">
              Show edited only
            </span>
          </label>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <p className="dark:text-gray-200">per page</p>
          </div>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className={`px-3 py-2 rounded-md transition ${
                page === 1
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              }`}
            >
              <ChevronsLeft />
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-3 py-2 rounded-md transition ${
                page === 1
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              }`}
            >
              <ChevronLeft />
            </button>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border rounded-md text-gray-700 dark:text-gray-200 font-medium">
              Page {page} / {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              disabled={page * itemsPerPage >= filteredData.length}
              onClick={() => setPage(page + 1)}
              className={`px-3 py-2 rounded-md transition ${
                page * itemsPerPage >= filteredData.length
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              }`}
            >
              <ChevronRight />
            </button>
            <button
              disabled={page * itemsPerPage >= filteredData.length}
              onClick={() => setPage(Math.ceil(filteredData.length / itemsPerPage))}
              className={`px-3 py-2 rounded-md transition ${
                page * itemsPerPage >= filteredData.length
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
              }`}
            >
              <ChevronsRight />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-auto">
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="w-6 px-4 py-3 text-gray-700 dark:text-gray-200">ID</th>
                  <th className="w-40 px-4 py-3 text-gray-700 dark:text-gray-200">ChatID</th>
                  <th className="px-6 py-3 text-gray-700 dark:text-gray-200">User</th>
                  <th className="px-6 py-3 text-gray-700 dark:text-gray-200">Bot</th>
                  <th className="w-8 px-6 py-3 text-gray-700 dark:text-gray-200">Edited</th>
                  <th className="w-32 px-4 py-3 text-gray-700 dark:text-gray-200">Time</th>
                  <th className="w-24 px-4 py-3 text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((chat) => (
                  <tr
                    key={chat.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
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
                          className="w-full border rounded px-2 py-1 min-h-[60px] bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                      ) : (
                        <ReactMarkdown>{chat.bot}</ReactMarkdown>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {chat.edited === 1 && <Check className="flex w-full" />}
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
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 bg-transparent"
                            >
                              <Save className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditForm(null);
                              }}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 bg-transparent"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(chat)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 bg-transparent"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(chat.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 bg-transparent"
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
    </div>
  );
};

export default Dashboard;