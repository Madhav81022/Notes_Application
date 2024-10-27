import { getInitials } from "../utils/helper"
import  { useContext, useRef,useEffect, useState } from 'react';
import { ThemeContext } from "../contexts/theme";
import { FaMoon, FaSun } from "react-icons/fa";


const ProfileInfo = ({onLogout,userInfo}) => {
  
 const { theme,toggleTheme } = useContext(ThemeContext);
const [isDropdownOpen,setIsDropdownOpen]=useState(false);
const dropdownRef = useRef(null);

 //Toggle dropdown
 const toggleDropdown=()=>{
  setIsDropdownOpen(!isDropdownOpen);
 }

 //close dropdown if clicked outside
 useEffect(()=>{
  const handleClickOutside = (event)=>{
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
      setIsDropdownOpen(false);
    }
  };
   document.addEventListener("mousedown",handleClickOutside);
   return()=>{
    document.removeEventListener("mousedown",handleClickOutside);
   }
 },[])


  return (
    <div className="relative flex items-center gap-3 ">

         <button className={` ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full font-medium boarder  `} 
         onClick={toggleTheme}>
           {theme==="light"?<FaMoon />:<FaSun/>}
         </button>
        
         {/* text-slate-950 font-medium  */}

         {/* Profile Button */}


        <div className={` ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}
        cursor-pointer w-8 h-8 md:w-12 md:h-12 flex items-center justify-center rounded-full `} onClick={toggleDropdown}>
         {getInitials(userInfo?.username)} 
         </div>
        {/* <div></div> */}

{/* Dropdown Menu */}
         {isDropdownOpen && 
         (
           <div ref={dropdownRef}
           className={`absolute top-14 right-0 w-36 md:w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50 
           ${theme === "dark"? "text-white":"text-black"}`}
           >
           <p className="text-sm font-medium">{userInfo?.username }</p>
           <hr className="my-2"/>

           <button className=" w-full text-left text-sm  p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-red-500 hover:text-white" 
           onClick={onLogout}>
           Logout
           </button>
           </div>
         )}
       
    </div>
   
  )
}

export default ProfileInfo