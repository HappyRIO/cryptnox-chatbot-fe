import { Route, Routes } from "react-router-dom";
import ChatInterface from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
// import QuestionsFetcher from "./pages/Question";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
