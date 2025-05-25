import { Route, Routes } from "react-router-dom";
import ChatInterface from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import UpdateDB from "./pages/UpdateDB";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/update" element={<UpdateDB />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
