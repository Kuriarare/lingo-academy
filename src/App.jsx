// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login"; 
import Home from "./sections/home";
import Profile from "./components/profile";
import Admin from "./components/admin"; 
import  {AuthProvider}  from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Learning from "./sections/learning";
// import VideoCall from "./components/videoCall";
import Shchedule from "./components/schedule";
import CallScreen from "./components/callScreen";
// import { MyUILayout } from "./stream/MyApp";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/learning" element={<Learning />} />
          <Route path="/schedule" element={<Shchedule/>} />
          <Route path="/call/:username/:room" element={<CallScreen />} />
          {/* <Route path="/class" element={<VideoCall/>} /> */}
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
