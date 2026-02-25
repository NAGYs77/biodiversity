import Navbar from './components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./components/Login";
import Species from "./components/Species";
import Register from "./components/Register";

function App() {

  const isAuthenticated = !!localStorage.getItem('userRole');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto"> 
        <Routes>
          
          <Route path="/" element={isAuthenticated ? <Navigate to="/species" /> : <Navigate to="/login" />} />
          
      
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/species" element={<Species />} />
          
        
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;