import { getInitials } from "../utils/helper";
import { useContext, useRef, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/theme";
import { FaMoon, FaSun } from "react-icons/fa";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import { ThemeContext } from "../contexts/theme";

const ProfileInfo = ({ onLogout, userInfo }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(userInfo?.profileImageUrl || "");
  const dropdownRef = useRef(null);
  const {isAuth} = useContext(ThemeContext);
   const navigate = useNavigate();

  //Load profile image URL on initial load
  useEffect(()=>{
    const fetchProfileImage = async () =>{
      if(userInfo?.uid)
      {
        const userDoc = await getDoc(doc(db,"users",userInfo.uid));
        if(userDoc.exists()){
            setProfileImageUrl(userDoc.data().profileImageUrl || "");
        }
      }
    };
    fetchProfileImage();
  },[userInfo]);

  const handleLogin=()=>{
    navigate("/login");
  }

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load profile image URL
  // useEffect(() => {
  //   if (userInfo?.profileImageUrl) {
  //     setProfileImage(userInfo.profileImageUrl);
  //   }
  // }, [userInfo]);

  // Upload profile image
const handleImageUpload = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;

    const imageRef = ref(storage, `profileImages/${userInfo?.uid}`);
    await uploadBytes(imageRef, file);

    // Retrieve the download URL after the upload completes
    const downloadUrl = await getDownloadURL(imageRef);
    console.log("Profile Image URL:", downloadUrl); // Debugging URL retrieval
    setProfileImageUrl(downloadUrl);

    // Update in Firestore
    if (userInfo?.uid) {
      await updateDoc(doc(db, "users", userInfo.uid), {
        profileImageUrl: downloadUrl,
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

  return (
    <div className="relative flex items-center gap-3">
      <div className="relative group">
        <button
          className={`${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          } w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full font-medium border`}
          onClick={toggleTheme}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        <span
          className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${
            theme === "dark" ? "bg-gray-600 text-white border-white" : "bg-gray-200 text-gray-800 border-gray-900"
          } text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}
        >
          {theme === "light" ? "Dark" : "Light"}
        </span>
      </div>
       
      {/* Profile Button */}
      <div className="relative group">
        <div
          className={`${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          } cursor-pointer w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full`}
          onClick={toggleDropdown}
        >
        { isAuth ?profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            getInitials(userInfo?.username)
          ): getInitials("Unknown") }

          
        </div>
        <span
          className={`absolute -bottom-14 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${
            theme === "dark" ? "bg-gray-600 text-white border-white" : "bg-gray-200 text-gray-800 border-gray-900"
          } text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}
        >
        { isAuth? <p className="text-sm font-medium">{userInfo?.username}</p>: <p className="text-sm font-medium">{"Unknown"}</p>}
          
        </span>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-14 right-0 w-36 md:w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          <p className="text-sm font-medium">{userInfo?.username}</p>
          <hr className="my-2" />
          <label className="block text-sm font-medium mb-2">Upload Profile Image:</label>
          <input type="file" onChange={handleImageUpload} className="text-xs text-gray-500" />
          <hr className="my-2" />

          
          <button
            className="w-full text-left text-sm p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-red-500 hover:text-white"
            onClick={isAuth? onLogout: handleLogin}
          >
            {isAuth? "Logout": "SignIn"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;