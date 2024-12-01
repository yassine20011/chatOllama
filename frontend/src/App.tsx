import './App.css'
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/notFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
