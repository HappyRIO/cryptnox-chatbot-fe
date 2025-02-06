import { Route, Routes } from "react-router-dom";
import ChatInterface from "./pages/Chat";
// import Header from "./components/Header";
// import Prompt from "./pages/Prompt";
// import Train from "./pages/Train";

function App() {

  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        {/* <Route path="/chat" element={<ChatInterface />} />
        <Route path="/train" element={<Train />} />
        <Route path="/prompt" element={<Prompt />} /> */}
      </Routes>
    </>
  );
}

export default App;
