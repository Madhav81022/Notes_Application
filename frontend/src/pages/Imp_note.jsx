import Navbar from "../Component/Navbar"
import { useSelector } from "react-redux"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import NotesCard from "../Component/Cards/NotesCard"
import { toast } from "react-toastify"
import { ThemeContext } from "../contexts/theme"
import { useContext } from "react"
import Modal from "react-modal"
import {MdClose} from "react-icons/md"
import moment from "moment";

const Imp_note = () => {

  const {theme} = useContext(ThemeContext);
    const {currentUser,loading,errorDispatch }=useSelector(
        (state)=>state.user
      )
    
      const [userInfo,setUserInfo] = useState(null)
      const [allNotes,setAllNotes]=useState([]);
     // const [isFav,setIsFav]=useState(false);

     const navigate =useNavigate()

    //  const [openAddEditModal,setOpenAddEditModel]=useState({
    //   isShown:false,
    //   type:"add",
    //   data:null,
    // })
  
    const [viewNoteModal, setViewNoteModal] = useState({ // State for viewing note modal
      isShown: false,
      data: null,
    });
      useEffect(()=>{
        //console.log(currentUser);
        if(currentUser===null || !currentUser)
        {
          navigate("/login")
        }
        else{
          setUserInfo(currentUser?.rest)
          getAllNotes();
          
        }
    },[])

    // const handleEdit=(noteDetails)=>{
    //   setOpenAddEditModel({isShown:true,data:noteDetails,type:"edit"})
    // }

     // console.log(allNotes);

     const updateIsFav = async(noteData)=>{
        const noteId = noteData._id;
      
        try {
          const res = await axios.put("http://localhost:3000/api/note/fav-note/"+noteId,
            {isFav: !noteData.isFav},
            {withCredentials:true}
          )
          
          if(res.data.success === false)
          {
            toast.error(res.data.message)
            console.log(res.data.message);
            return
          }
      
         toast.success(res.data.message)
         getAllNotes()
        } catch (error) {
          console.log(error.message);
          toast.error(error.message);
        }
      }

      
    const getAllNotes = async()=>{
        try{
          const res= await axios.get("http://localhost:3000/api/note/fav-notes",
            {withCredentials:true,}
          )
          
          if(res.data.success === false)
          {
            toast.error(res.data.message)
            return
          }
          //console.log(res);
          
          setAllNotes((prev) => [...prev,...res.data.note]);

          //console.log("Favorite notes fetched: ",res.data.notes)
        }
        catch(error){
           
          console.log(error);
        }
      }


//console.log(allNotes);

  return (
    <div className={`${theme ===  'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} min-h-screen  py-4 pt-12 mx-auto px-4`}>
 <Navbar userInfo={userInfo} />

   {allNotes.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ">
        {allNotes.map((note) => (
          <NotesCard
            key={note._id}
            title={note.title}
            date={note.createdAt}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            isFav={note.isFav}
            onPinNote={() => {/* Handle pinning if needed */}}
             onFavNote={() => updateIsFav(note)}
             onView={() => {
    setViewNoteModal({ isShown: true, data: note });
  }}
          />
        ))}
        </div>
      ) : (
        <p>No favorite notes found.</p>
      )} 

      
  <Modal
  isOpen={viewNoteModal.isShown}
  onRequestClose={() => setViewNoteModal({ isShown: false, data: null })}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    content: {
      backgroundColor: theme === "dark" ? "#2D3748" : "#fff", // Set modal background according to theme
      color: theme === "dark" ? "#fff" : "#000", // Set text color according to theme
      padding: "20px", // Padding inside the modal
      borderRadius: "10px", // Rounded corners for the modal
      maxWidth: "600px", // Limit the width
      margin: "auto", // Center the modal
      marginTop:"68px",
      position:"relative",
      zIndex:"1000",
    },
  }}
  contentLabel="View Note"
  className="w-full max-w-md md:max-w-lg lg:max-w-xl max-h-3/4 rounded-md mx-auto mt-14 p-5 overflow-auto"
>
  {viewNoteModal.data && (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{viewNoteModal.data.title}</h2>
        <MdClose
          className="cursor-pointer text-gray-600"
          onClick={() => setViewNoteModal({ isShown: false, data: null })}
        />
      </div>
      <p className="text-sm mb-4">
        {moment(viewNoteModal.data.createdAt).format("Do MMM YYYY")}
      </p>
      <p className="text-base">{viewNoteModal.data.content}</p>
      <div className="mt-4 text-xs">
        {viewNoteModal.data.tags.map((tag) => ` #${tag} `)}
      </div>
    </div>
  )}
</Modal>
      
    </div>
   
  )
}

export default Imp_note