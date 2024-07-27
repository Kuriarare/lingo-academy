import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
// import DataContext from "../context/context";
import avatar from "../assets/logos/avatar.jpg";
import Modal from "./modal";

const Profile = () => {
  // const data = useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUploadSuccess = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl);
    window.location.reload();
  };
  
  const handleSaveAvatar = (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    fetch("http://localhost:3001/uploadavatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        handleUploadSuccess(data.avatarUrl);
      })
      .catch((error) => console.error("Error:", error));
  };
  

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

  useEffect(() => {
    fetch("http://195.110.58.68:3001/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setName(data.name);
        setLastName(data.lastName);
        setPhone(data.phone);
        setEmail(data.email);
        setAddress(data.address);
        setCity(data.city);
        setCountry(data.country);
        setPostal(data.postal);
        setBiography(data.biography);
        setAvatarUrl(data.avatarUrl);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleSaveProfile = () => {
    fetch("http://195.110.58.68:3001/updateuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        lastName,
        phone,
        email,
        address,
        city,
        country,
        postal,
        biography,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  // if (!data) {
  //   return <div></div>;
  // }

  return (
    <div className="flex w-full h-[153vh] relative ">
      <Dashboard />
      <div className="w-full">
        <section className="w-full h-[63vh] custom-bg-profile overflow-hidden relative">
          <div className="container w-full">
            <Navbar />
            <div className="flex flex-col justify-center text-white w-full text- absolute top-[31%]">
              <h2 className="text-[2.75rem]">Hello {name}</h2>
              <p className="max-w-[30rem] mt-4 mb-12">
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

        <section className="flex h-screen">
          <div className="container w-full ml-[2.5rem] relative">
            <div className="absolute bottom-[6rem] left-[0rem] flex">
              <div className="w-[58.2rem] bg-[#F7FAFC] rounded-lg box-shadow-form overflow-hidden">
                <div className="flex justify-between items-center bg-white py-[0.8rem] px-3 shadow-sm">
                  <h2 className="text-[1.0625rem] text-[#32325D]">My Account</h2>
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
                <div className="p-[1.5rem] pb-0">
                  <form action="">
                    <h2 className="text-[0.75rem] text-[#8898AA] mb-6">
                      USER INFORMATION
                    </h2>

                    <div className="flex mb-12">
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <div className="flex mb-14">
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={email}
                          readOnly
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                        />
                      </div>
                    </div>
                    <hr />
                    <h2 className="text-[0.75rem] text-[#8898AA] mt-[1.5rem] mb-6">
                      CONTACT INFORMATION
                    </h2>
                    <div className="flex mb-12">
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <div className="flex mb-14">
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                      <div className="flex flex-col pl-[1.5rem] w-full">
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
                          value={postal}
                          onChange={(e) => setPostal(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                    <hr />
                    <h2 className="text-[0.75rem] text-[#8898AA] mt-[1.5rem] mb-6">
                      ABOUT ME
                    </h2>
                    <div className="flex mb-12">
                      <div className="flex flex-col pl-[1.5rem] w-full">
                        <label
                          htmlFor="biography"
                          className="text-[0.875rem] text-[#525F7F] font-semibold"
                        >
                          Biography
                        </label>
                        <textarea
                          id="biography"
                          name="biography"
                          value={biography}
                          onChange={(e) => setBiography(e.target.value)}
                          className="w-full rounded-md py-2 px-5 text-[#8898AA] text-[0.96rem] focus:outline-none focus:border-blue-500 box-shadow-inputs resize-none"
                          rows="3"
                          readOnly={!isEditMode}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="ml-[1.5rem] bg-white w-[29.4rem] flex flex-col rounded-lg relative">
                <div>
                  <img
                    src={!avatarUrl ? avatar : avatarUrl}
                    alt="avatar"
                    className="w-[10rem] rounded-full absolute top-[-3rem] left-[34%]"
                  />
                  <div className="bg-[#D8DADF] flex justify-center items-center w-7 h-7 absolute top-[4.7rem] left-[60%] cursor-pointer z-10 rounded-full">
                    <i className="fa-solid fa-camera camera-icon" onClick={handleOpenModal}></i>
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAvatar} /> 
                  </div>
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
