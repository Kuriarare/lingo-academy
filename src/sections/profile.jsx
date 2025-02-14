import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import Modal from "../components/modal";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, uploadAvatar } from "../redux/userSlice";
import avatar from "../assets/logos/avatar.jpg";
import { v4 as uuidv4 } from "uuid";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const header = "USER PROFILE";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postal, setPostal] = useState("");
  const [biography, setBiography] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [teacherAssigned, setTeacherAssigned] = useState("");
  // useEffect(() => {
  //   console.log('User state updated:', user);
  // }, [user]);

 useEffect(() => {
  if (user.role === 'user') {
    setName(user.name);
    setLastName(user.lastName);
    setPhone(user.phone);
    setEmail(user.email);
    setAddress(user.address);
    setCity(user.city);
    setCountry(user.country);
    setPostal(user.postal);
    setBiography(user.biography);
    setAvatarUrl(user.avatarUrl);

    // Check if studentSchedules exists and has at least one item
    if (user.studentSchedules && user.studentSchedules.length > 0) {
      setTeacherAssigned(user.studentSchedules[0].teacherName);
    } else {
      setTeacherAssigned(""); // Set to an empty string if no teacher assigned
    }
  } else {
    setName(user.name);
    setLastName(user.lastName);
    setPhone(user.phone);
    setEmail(user.email);
    setAddress(user.address);
    setCity(user.city);
    setCountry(user.country);
    setPostal(user.postal);
    setBiography(user.biography);
    setAvatarUrl(user.avatarUrl);
  }
}, [user]);

const dispatch = useDispatch();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAvatar = (file) => {
    const uniqueFileName = `${uuidv4()}-${file.name}`; 
    const formData = new FormData();
    formData.append("file", file, uniqueFileName);
  
    formData.append("userId", user.id);
  
    dispatch(uploadAvatar(formData))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setIsModalOpen(false);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };


  const handleSaveProfile = () => {
    const updatedUser = {
      name,
      lastName,
      phone,
      email,
      address,
      city,
      country,
      postal,
      biography,
    };
  
    dispatch(updateUser(updatedUser))
      .then((response) => {
        console.log("Update user response:", response);
        if (response.meta.requestStatus === "fulfilled") {
          setIsEditMode(false);
        } else {
          console.error("Failed to update user:", response.error.message);
        }
      })
      .catch((error) => console.error("Error in updating user:", error));
  };

  
  
  return (
    <div className="flex w-full h-[97vh] ">
      <Dashboard />
      <div className="w-full h-[100vh] overflow-y-auto ">
        <section className="w-full h-[36vh] custom-bg-profile  relative">
          <div className="container w-full">
            <Navbar header={header} />
            <div className="flex flex-col justify-center text-white w-full mt-2">
              <h2 className="2xl:text-[2.75rem] text-[2.3rem]">Hello {name}</h2>
              <p className="max-w-[30rem] mt-4 mb-10">
                This is your profile page. You can see the progress you&apos;ve
                made with your work and manage your personal information.
              </p>
              <div>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="flex ">
          <div className="container w-full ">
            <div className="lg:flex">
              <div className="2xl:w-[58.2rem] max-w-[58.2rem] bg-[#F7FAFC] rounded-lg box-shadow-form overflow-hidden">
                <div className="flex justify-between items-center bg-white py-[0.8rem] px-3 shadow-sm">
                  <h2 className="text-[1.0625rem] text-[#32325D]">
                    My Account
                  </h2>
                  {isEditMode && (
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={handleSaveProfile}
                    >
                      SAVE
                    </button>
                  )}
                </div>
                <div className="py-[1.5rem] 2xl:px-[1.5rem] px-[0.7rem] pb-0">
                  <form action="">
                    <h2 className="text-[0.75rem] text-[#8898AA] mb-6">
                      USER INFORMATION
                    </h2>

                    <div className="flex mb-12">
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="name"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={name || ""}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="lastName"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={lastName || ""}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <div className="flex mb-14">
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="phone"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Phone
                        </label>
                        <input
                          type="number"
                          id="phone"
                          name="phone"
                          value={phone || ""}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="email"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email || "" }
                          readOnly
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                        />
                      </div>
                    </div>
                    <hr />
                    <h2 className="text-[0.75rem] text-[#8898AA] mt-[1.5rem] mb-6">
                      CONTACT INFORMATION
                    </h2>
                    <div className="flex mb-12">
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="address"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={address || ""}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <div className="flex mb-14">
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="city"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={city || ""}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="country"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={country || ""}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="postal-code"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Postal code
                        </label>
                        <input
                          type="number"
                          id="postal-code"
                          name="postal-code"
                          value={postal || ""}
                          onChange={(e) => setPostal(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <hr />
                    <h2 className="text-[0.75rem] text-[#8898AA] mt-[1.5rem] mb-6">
                      ABOUT ME
                    </h2>
                    <div className="flex mb-12">
                      <div className="flex flex-col 2xl:pl-[1.5rem] pl-[0.75rem] w-full">
                        <label
                          htmlFor="biography"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Biography
                        </label>
                        <textarea
                          id="biography"
                          name="biography"
                          value={biography || ""}
                          onChange={(e) => setBiography(e.target.value)}
                          className="w-full rounded-md py-2 2xl:px-5 px-3 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs resize-none"
                          rows="3"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="xl:ml-[1.5rem] lg:ml-[0.8rem] bg-white lg:w-[29.4rem] lg:mt-0 mt-4 h-auto flex flex-col rounded-lg items-center just ">
                <div className="relative">
                  <img
                    src={!avatarUrl ? avatar : avatarUrl}
                    alt="avatar"
                    className="w-[10rem] h-[10rem] object-cover rounded-full mt-1"
                  />
                  <div className="bg-[#D8DADF] flex justify-center items-center w-7 h-7 absolute top-[7rem] left-[80%] cursor-pointer z-10 rounded-full">
                    <i
                      className="fa-solid fa-camera camera-icon"
                      onClick={handleOpenModal}
                    ></i>
                    <Modal
                      isOpen={isModalOpen}
                      onClose={handleCloseModal}
                      onSave={handleSaveAvatar}
                    />
                  </div>
                </div>
                  {(user.role === 'user') && (
                    <div className="flex flex-col items-center mt-5">
                      <h3>My teacher:  {teacherAssigned}</h3>
                    </div>
                  )}
                <div>
                  <h2>More features soon...</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
