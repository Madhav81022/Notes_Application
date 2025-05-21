import SearchBar from "./SearchBar"
import ProfileInfo from "./ProfileInfo"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signoutFailure, signoutStart, signoutSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../contexts/theme";
import { FaBars } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from 'react-icons/io'; 

const Navbar = ({userInfo,onSearchNote,handleClearSearch}) => {

    const {theme} = useContext(ThemeContext);
    const [searchQuery,setSearchQuery]=useState("");
    const [isMobileSearchOpen,setIsMobileSearchOpen]=useState(false);
    const [isSidebarOpen,setIsSidebarOpen]= useState(false);


    const navigate=useNavigate();
    const dispatch = useDispatch();

    const handleSearch=()=>{
      if(searchQuery)
      {
        onSearchNote(searchQuery);
      }
    }
    const onClearSearch=()=>{
        setSearchQuery("")
        handleClearSearch()
    }

    const handleOutsideClick =(e)=>{
      if(e.target.id==="overlay")
      {
        setIsMobileSearchOpen(false);
      }
    };

    const onLogout=async()=>{
       try{
           dispatch(signoutStart())

           const res = await axios.get("https://notes-application-3emx.onrender.com/api/auth/signout",{withCredentials:true})
       
           if(res.data.success === false)
           {
            dispatch(signoutFailure(res.data.message))
            toast.error(res.data.message)
            return
           }

           toast.success(res.data.message)
           dispatch(signoutSuccess())
           navigate("/login")
          }
       catch(error)
       {
        toast.error(error.message);
        dispatch(signoutFailure(error.message));
       }
    }

  

  return (
 
    <div className={`navbar fixed top-0 left-0 w-full z-50 ${theme ==='dark' ?'bg-gray-900 text-white':'bg-slate-100 text-black'} flex items-center justify-between px-5 py-2 drop-shadow-md `}>
      
      {/* Siderbar Toggle for mobile */}
      <button className="md:hidden text-slate-600 " onClick={()=>setIsSidebarOpen(true)}>
      <FaBars className="text-2xl"/>
      </button>
      
      <div className="flex justify-center items-center gap-x-4">
      <Link to={"/"}>
      <h2 className=" text-xl font-medium text-black py-2">
        <span className="text-slate-400">Good</span>
        <span className=" text-slate-600">Notes</span>
       </h2>
      </Link>
       
       <Link to={"/imp_note"}>
       <button className="text-sm bg-red-500 p-1  rounded-md text-white hover:opacity-80 hidden md:inline-block" >Favorite Notes</button>
       </Link>
       </div>

        <div className="hidden md:flex flex-grow justify-center">
       <SearchBar value={searchQuery}
        onChange={({target})=>setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}  
       />
       </div>

       {/* Search Icon for mobile (Open Search Modal) */}
       <button className="md:hidden text-slate-600" onClick={()=> setIsMobileSearchOpen(true)}>
        <FaMagnifyingGlass className="text-2xl"/>
       </button>

       <ProfileInfo userInfo={userInfo}  onLogout={onLogout}/>

       {/* Mobile Search Modal */}
       {isMobileSearchOpen && (
        <div id="overlay" className={`fixed inset-0  bg-opacity-75 flex items-center justify-center z-50`} >
          <div className={`w-full max-w-md px-16 h-full bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out flex justify-center items-center
          ${isMobileSearchOpen ? "translate-x-0":"translate-x-full"
          }`}>
         
          {/* <div className="mt-8"> */}
          <SearchBar value={searchQuery}
          onChange={({target})=>setSearchQuery(target.value)}
          handleSearch={()=>{
            handleSearch();
            setIsMobileSearchOpen(false);
          }}
          onClearSearch={()=>{
            onClearSearch()
            setIsMobileSearchOpen(false);
            }} 
          />
          
            {/* close button */}
            <div className="flex justify-center items-center ">
           <button onClick={()=> setIsMobileSearchOpen(false)} className="text-slate-600 dark:text-white text-2xl">
            <IoMdClose/>
           </button>
           </div>

          </div>
        </div>
       )}


      


       {/* Sidebar for mobile */}

       {isSidebarOpen && (
        <div className={`fixed inset-0  bg-opacity-50 z-50`} onClick={()=> setIsSidebarOpen(false)}>
          <div className={`absolute top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}
          onClick={(e)=>e.stopPropagation()}
          >

           {/* Sidebar Header with close Button */}
           <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button className="text-xl" onClick={() => setIsSidebarOpen(false)}>
                <IoMdClose className="text-slate-600 dark:text-white" />
              </button>
        
            </div>

            <div className="p-4 flex flex-col gap-4 bg-black text-white ">
            
            {/* Sidebar link */}

            <Link to="/" className=" text-base text-blue-500 hover:underline " onClick={()=> setIsSidebarOpen(false)}>
              Good Notes
            </Link>

            <Link to="/imp_note" className=" text-base text-blue-500 hover:underline " onClick={()=> setIsSidebarOpen(false)}>
              Favorite Notes
            </Link>

            </div>
          </div>

        </div>
       )}
    </div>
   
  )
}

export default Navbar