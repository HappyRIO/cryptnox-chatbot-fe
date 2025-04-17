import { Route, Routes } from "react-router-dom";
import ChatInterface from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import UpdateDB from "./pages/UpdateDB";
// import QuestionsFetcher from "./pages/Question";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update" element={<UpdateDB />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
