// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login"; 
import Home from "./sections/home";
import Profile from "./sections/profile";
import Admin from "./components/admin"; 
import Learning from "./sections/learning";
import Shchedule from "./sections/schedule";
import CallScreen from "./components/callScreen";
import Teachers from "./sections/teachers";


function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/admin"
            element={
             
                <Admin />
             
            }
          />
          <Route path="/learning" element={<Learning />} />
          <Route path="/schedule" element={<Shchedule/>} />
          <Route path="/call/:username/:room" element={<CallScreen />} />
          {/* <Route path="/class" element={<VideoCall/>} /> */}
          <Route path="/teachers" element={<Teachers />} />
          
        </Routes>
      </Router>
   
  );
}

export default App;
