import { useEffect, useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import Modal from "../components/admin/modal";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, uploadAvatar } from "../redux/userSlice";
import avatar from "../assets/logos/avatar.jpg";
import { v4 as uuidv4 } from "uuid";
import { FiUser, FiBookOpen, FiAward } from "react-icons/fi";

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

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setCountry(user.country || "");
      setPostal(user.postal || "");
      setBiography(user.biography || "");
      setAvatarUrl(user.avatarUrl || "");

      if (user.role === 'user' && user.studentSchedules && user.studentSchedules.length > 0) {
        setTeacherAssigned(user.studentSchedules[0].teacherName);
      } else {
        setTeacherAssigned("");
      }
    }
  }, [user]);

  const dispatch = useDispatch();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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

  const handleEditProfile = () => setIsEditMode(true);

  const handleSaveProfile = () => {
    const updatedUser = { name, lastName, phone, email, address, city, country, postal, biography };
    dispatch(updateUser(updatedUser))
      .then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setIsEditMode(false);
        } else {
          console.error("Failed to update user:", response.error.message);
        }
      })
      .catch((error) => console.error("Error in updating user:", error));
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full h-screen overflow-y-auto">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md relative border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header={header} />
            <div className="flex flex-col md:flex-row justify-between md:items-center text-white py-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold">Hello {name}</h2>
                <p className="max-w-md mt-2 text-white/80">
                  This is your profile page. You can see the progress you've made and manage your personal information.
                </p>
              </div>
              <button
                type="button"
                className="mt-4 md:mt-0 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        <main className="p-4 md:p-8">
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 lg:order-2">
                <div className="bg-white dark:bg-brand-dark-secondary rounded-lg shadow-md p-6 flex flex-col items-center border border-gray-200 dark:border-purple-500/20">
                  <div className="relative mb-8">
                    <img
                      src={!avatarUrl ? avatar : avatarUrl}
                      alt="avatar"
                      className="w-28 h-28 object-cover rounded-full border-4 border-purple-500/50"
                    />
                    <div className="absolute bottom-0 right-0 bg-gray-300 dark:bg-gray-700 flex justify-center items-center w-8 h-8 cursor-pointer rounded-full">
                      <i className="fa-solid fa-camera camera-icon text-gray-800 dark:text-white" onClick={handleOpenModal}></i>
                      <Modal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAvatar} />
                    </div>
                  </div>
                  {(user.role === 'user') && (
                    <div className="w-full">
                      <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-purple-500/20 pb-4">My Learning</h3>
                      <div className="grid grid-cols-1 gap-6 mt-6">
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg transition-transform transform hover:scale-105">
                          <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                            <FiUser className="text-purple-600 dark:text-brand-purple h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">My Teacher</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{teacherAssigned || 'Not Assigned'}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg transition-transform transform hover:scale-105">
                          <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                            <FiBookOpen className="text-green-600 dark:text-brand-teal h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg capitalize">{user.language || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg transition-transform transform hover:scale-105">
                          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full">
                            <FiAward className="text-yellow-600 dark:text-brand-orange h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Level</p>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">Beginner</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {user.role === 'teacher' && (
                    <div className="w-full">
                      <h3 className="font-bold text-xl mb-6 text-gray-800 dark:text-white border-b border-gray-200 dark:border-purple-500/20 pb-4">My Students</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar mt-6">
                        {user.students && user.students.length > 0 ? (
                          user.students.map((student) => (
                            <div key={student.id} className="flex items-center p-4 bg-gray-50 dark:bg-brand-dark rounded-lg transition-transform transform hover:scale-105">
                              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                                <FiUser className="text-purple-600 dark:text-brand-purple h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <p className="font-bold text-gray-900 dark:text-white text-lg">{student.name} {student.lastName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-center">You have no students assigned.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 lg:order-1 bg-[#F7FAFC] dark:bg-brand-dark-secondary rounded-lg box-shadow-form overflow-hidden border border-gray-200 dark:border-purple-500/20">
                <div className="flex justify-between items-center bg-white dark:bg-brand-dark py-3 px-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-[#32325D] dark:text-white">My Account</h2>
                  {isEditMode && (
                    <button
                      type="button"
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      onClick={handleSaveProfile}
                    >
                      SAVE
                    </button>
                  )}
                </div>
                <div className="p-6">
                  <form>
                    <h2 className="text-xs font-semibold text-[#8898AA] dark:text-gray-400 mb-6">USER INFORMATION</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Name</label>
                        <input type="text" id="name" name="name" value={name || ""} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value={lastName || ""} onChange={(e) => setLastName(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="phone" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Phone</label>
                        <input type="number" id="phone" name="phone" value={phone || ""} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="email" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Email</label>
                        <input type="email" id="email" name="email" value={email || ""} readOnly className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-500 bg-gray-100 dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" />
                      </div>
                    </div>
                    <hr className="border-gray-200 dark:border-purple-500/20" />
                    <h2 className="text-xs font-semibold text-[#8898AA] dark:text-gray-400 mt-6 mb-6">CONTACT INFORMATION</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Address</label>
                        <input type="text" id="address" name="address" value={address || ""} onChange={(e) => setAddress(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="city" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">City</label>
                        <input type="text" id="city" name="city" value={city || ""} onChange={(e) => setCity(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="country" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Country</label>
                        <input type="text" id="country" name="country" value={country || ""} onChange={(e) => setCountry(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                      <div>
                        <label htmlFor="postal-code" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Postal code</label>
                        <input type="number" id="postal-code" name="postal-code" value={postal || ""} onChange={(e) => setPostal(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20" readOnly={!isEditMode} />
                      </div>
                    </div>
                    <hr className="border-gray-200 dark:border-purple-500/20" />
                    <h2 className="text-xs font-semibold text-[#8898AA] dark:text-gray-400 mt-6 mb-6">ABOUT ME</h2>
                    <div>
                      <label htmlFor="biography" className="text-sm font-semibold text-[#525F7F] dark:text-gray-300">Biography</label>
                      <textarea id="biography" name="biography" value={biography || ""} onChange={(e) => setBiography(e.target.value)} className="w-full mt-1 rounded-md py-2 px-3 text-[#8898AA] dark:text-gray-300 bg-white dark:bg-brand-dark focus:outline-none box-shadow-inputs border border-gray-300 dark:border-purple-500/20 resize-none" rows="3" readOnly={!isEditMode} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
