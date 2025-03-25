import { Route, Routes } from "react-router-dom";
import ChatInterface from "./pages/Chat";
// import QuestionsFetcher from "./pages/Question";

function App() {
  return (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        {/* <Route path="/test" element={<QuestionsFetcher />} /> */}
      </Routes>
    </>
  );
}

export default App;
