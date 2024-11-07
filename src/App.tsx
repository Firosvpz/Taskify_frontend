import { Routes,Route } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { PublicUserProtectedRoute, UserProtectedRoute } from "./components/ProtectedRoute";



function App() {
  return (
    <>
     <Toaster position="top-center" reverseOrder={false} />
      
   <Routes>
   <Route element={<PublicUserProtectedRoute />}>
    <Route path="/" element={<Register/>}/>
    <Route path="/login" element={<Login/>}/>
    </Route>
    <Route element={<UserProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard/>}/>
    </Route>
   </Routes>
    
    </>
  )
}

export default App
