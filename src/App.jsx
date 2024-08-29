import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './auth/Login';
import Layout from "./pages/Layout";
import Register from "./auth/Register";
import Home from "./pages/Home";
import DirectMessages from "./pages/DirectMessages";

function App() {
  return (
    
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="directmessages" element={<DirectMessages />} />
        <Route path="register" element={<Register />} />
        </Route>
      </Routes>
      </BrowserRouter>
    
  )
}

export default App;
