import './App.css'
import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/notFound";
import Signin from "./pages/signin";
import Signup from './pages/signup';
import Conversation from './pages/conversation';
import { AuthContextProvider } from './context/AuthContext';
import PrivateRoute from './pages/priveteRoute';

function App() {

  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/chat' element={<PrivateRoute />}>
            <Route path=':conversationId' element={<Conversation />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </>
  )
}

export default App
