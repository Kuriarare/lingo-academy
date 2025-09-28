// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import Home from './sections/home';
import Profile from './sections/profile';
import Admin from './components/admin/admin';
import Learning from './sections/learning';
import Shchedule from './components/schedule/schedule';
import RequireAuth from './components/requireAuth';
import JitsiClassRoom from './components/JitsiClassRoom';
import Messages from './sections/messages';
import ForgotPassword from './components/login/forgotPassword';
import ResetPassword from './components/login/resetPassword';
import GlobalNotificationHandler from './components/GlobalNotificationHandler';

function App() {


  return (
    <Router>
      <GlobalNotificationHandler />
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
         <Route path="/forgotpassword" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
