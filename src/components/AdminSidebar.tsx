
import { Link } from "react-router-dom";
import { LayoutDashboard, Database } from "lucide-react";

const AdminSidebar = () => {
  return (
    <div className="fixed w-52 h-screen bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </Link>
        <Link
          to="/admin/update"
          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Database className="w-5 h-5 mr-3" />
          Embedding
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;
