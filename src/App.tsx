import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Chapter01Page from "./pages/Chapter01Page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ch01" element={<Chapter01Page />} />
      </Routes>
    </BrowserRouter>
  );
}
