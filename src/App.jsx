// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Home from './sections/home';
import Profile from './sections/profile';
import Admin from './components/admin';
import Learning from './sections/learning';
import Shchedule from './sections/schedule';
import RequireAuth from './components/requireAuth';
import JitsiClassRoom from './components/JitsiClassRoom';
import Messages from './sections/messages';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/learning"
          element={
            <RequireAuth>
              <Learning />
            </RequireAuth>
          }
        />
        <Route
          path="/schedule"
          element={
            <RequireAuth>
              <Shchedule />
            </RequireAuth>
          }
        />
        {/* <Route
          path="/call/:username/:room"
          element={
            <RequireAuth>
              <CallScreen />
            </RequireAuth>
          }
        /> */}
          <Route
          path="/classroom"
          element={
            <RequireAuth>
              <JitsiClassRoom />
            </RequireAuth>
          }
        />
        <Route
          path="/messages"
          element={
            <RequireAuth>
               <Messages  />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
