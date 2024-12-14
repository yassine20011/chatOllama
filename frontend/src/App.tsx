import './App.css'
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/notFound";
import Signin from "./pages/signin";
import Signup from './pages/signup';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
