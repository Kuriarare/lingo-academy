import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AnimatedLogo from "./LoginLogo";

import { loginUser } from "../../redux/userSlice";
import LoginForm from "./LoginForm";
import Footer from "./Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStatus = useSelector((state) => state.user.status);
  const userError = useSelector((state) => state.user.error);

  const handleLogin = (event) => {
    event.preventDefault();
    const formattedEmail = email.trim().toLowerCase();
    const data = { email: formattedEmail, password };

    dispatch(loginUser(data)).then((action) => {
      if (action.payload?.token) {
        navigate("/home");
        window.location.reload();
      }else {
        Swal.fire({
          title: "Login Failed",
          text: 'Wrong credentials. If you cannot remember your password, please click on the "Forgot Password" link below the login form.',
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a1a2e]">
      <div className="flex flex-1 flex-col md:flex-row justify-center items-center px-4 py-8 md:px-8">
        <AnimatedLogo />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          userStatus={userStatus}
          userError={userError}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Login;