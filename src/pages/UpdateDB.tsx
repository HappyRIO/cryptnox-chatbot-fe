// UpdateDB.tsx
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const UpdateDB = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://chatbot.cryptnox.com/api/db_indexer",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.text();
        setMessage("✅ Vector DB update triggered successfully!");
        console.log("Response:", result);
      } else {
        setMessage("❌ Failed to update Vector DB.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminSidebar />
      <div className="flex flex-col w-screen h-screen pl-60 bg-gray-100 p-4 text-black">
        <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-xl font-semibold mb-4">🔄 Update Vector DB</h1>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Now"}
          </button>
          {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UpdateDB;
