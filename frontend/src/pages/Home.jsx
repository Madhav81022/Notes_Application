import {useEffect, useState} from "react"
import NotesCard from "../Component/Cards/NotesCard"
import {MdAdd,MdClose} from "react-icons/md"
import Modal from "react-modal"
import AddEditNotes from "./AddEditNotes"
import {useSelector} from "react-redux"
import { useNavigate } from "react-router-dom"
import Navbar from "../Component/Navbar"
import axios from "axios"
import { toast } from "react-toastify"
import EmptyCard from "../Component/Cards/EmptyCard"
 import  { useContext } from 'react';
 import { ThemeContext } from "../contexts/theme"
import moment from "moment";

const Home = () => {

   const { theme } = useContext(ThemeContext);

  const {currentUser,loading,errorDispatch }=useSelector(
    (state)=>state.user
  )

  const [userInfo,setUserInfo] = useState(null)
  const [allNotes,setAllNotes]=useState([]);

  const [isSearch,setIsSearch]=useState(false);

  const navigate= useNavigate()

  const [openAddEditModal,setOpenAddEditModel]=useState({
    isShown:false,
    type:"add",
    data:null,
  })

  const [viewNoteModal, setViewNoteModal] = useState({ // State for viewing note modal
    isShown: false,
    data: null,
  });

  useEffect(()=>{
    console.log(currentUser);
    if(currentUser===null || !currentUser)
    {
      navigate("/login")
    }
    else{
      setUserInfo(currentUser?.rest)
      getAllNotes();
      
    }
},[])

//get all notes -> To call api
const getAllNotes = async()=>{
  try{
    const res= await axios.get("https://notes-application-3emx.onrender.com/api/note/all",
      {withCredentials:true}
    )
    
    if(res.data.success === false)
    {
      console.log(res.data);
      return
    }

    setAllNotes(res.data.notes);
    //setAllNotes((prev) => [...prev,...res.data.notes])
    console.log(res);

  }
  catch(error){
    console.log(error);
  }
}


const handleEdit=(noteDetails)=>{
  setOpenAddEditModel({isShown:true,data:noteDetails,type:"edit"})
}

// Handle view note details
// const handleViewNote = (noteDetails) => {
//   setViewNoteModal({ isShown: true, data: noteDetails });
// };

// const closeViewNoteModal = () => {
//   setViewNoteModal({ isShown: false, data: null });
// };

//Delete note
const deleteNote = async(data) =>{
  const noteId = data._id

  try {
    const res= await axios.delete("https://notes-application-3emx.onrender.com/api/note/delete/" + noteId,
      {withCredentials:true}
    )

    if(res.data.success === false)
    {
      console.log(res.data.message)
      toast.error(res.data.message);
      return
    }

    toast.success(res.data.message)
    getAllNotes()
  } catch (error) {
    toast.error(error.message);
    console.log(error.message)
  }
}

const onSearchNote= async (query)=>{
  try {
    const res = await axios.get("https://notes-application-3emx.onrender.com/api/note/search",
      {params:{query},
    withCredentials:true,
    })

    if(res.data.success === false)
    {
      toast.error(res.data.message);
      console.log(res.data.message);
      return
    }

    setIsSearch(true)
    setAllNotes(res.data.notes);

  } catch (error) {
    toast.error(error.message)
  }
}

const handleClearSearch=()=>{
  setIsSearch(false)
   getAllNotes()
}

//UpdateIsPinned Note
const updateIsPinned = async(noteData)=>{
  const noteId = noteData._id;

  try {
    const res = await axios.put("https://notes-application-3emx.onrender.com/api/note/update-note-pinned/"+noteId,
      {isPinned: !noteData.isPinned},
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
  }
}

//Update favorite Note
const updateIsFav = async(noteData)=>{
  const noteId = noteData._id;

  try {
    const res = await axios.put("https://notes-application-3emx.onrender.com/api/note/fav-note/"+noteId,
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
  }
}
//max-md:m-5
console.log(allNotes)
  return (
    <>
  <div className={`${theme ===  'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} min-h-screen`}>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/> 
    <div className= "container mx-auto px-4 py-4 pt-12" >
     {allNotes.length>0 ? (
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ">
        {allNotes.map((note,index)=>(
          <NotesCard
            key={note._id}
            title={note.title}
            date={note.createdAt}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            isFav={note.isFav}
            onEdit={()=>{
              handleEdit(note)
            }}
            onDelete={()=>{
               deleteNote(note)
            }}
            onPinNote={()=>{
               updateIsPinned(note)
            }}
            onFavNote={()=>{
                updateIsFav(note)
            }}
            onView={() => {
    setViewNoteModal({ isShown: true, data: note });
  }}
          />
        ))}
      </div>)
      : <EmptyCard imgSrc={isSearch ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDSS5FeaLtelZwa1H2RbgdzrnuUt_oJEP0XA&s"
      :"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDCtZLuixBFGTqGKdWGLaSKiO3qyhW782aZA&s"} 

     message={isSearch ? "Oops! No Notes found matching your search":`Ready to capture your ideas? CLick the 'Add' button to start noting down your thoughts, inspiration and remembers. Let's get started!`}/>}
    </div>
    <button className=" fixed w-16 h-16 flex items-center justify-center rounded-2xl bg-[#2B85FF] hover:bg-blue-600  right-10 bottom-10"
    onClick={()=>{
      setOpenAddEditModel({isShown:true,type:"add",data:null })
    }}
    >
    <MdAdd className="text-[32px] text-white" />
    </button>
  
    <Modal
    isOpen={openAddEditModal.isShown}
    onRequestClose={()=>{}}
    style={
      {
        overlay:{
          backgroundColor:"rgba(0,0,0,0.2)",
        },
      }}
      contentLabel=""
      className=" w-full max-w-md md:max-w-lg lg:max-w-xl   max-h-3/4  rounded-md mx-auto mt-14 p-5 overflow-auto"
      >

      <AddEditNotes 
        onClose={()=> setOpenAddEditModel({isShown:false,type:"add", data:null})}
        noteData={openAddEditModal.data}
        type={openAddEditModal.type}
        getAllNotes={getAllNotes}
      />
    </Modal>

       {/* View Note Modal */}
       {/* <Modal
          isOpen={viewNoteModal.isShown}
          onRequestClose={closeViewNoteModal}
          style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
          className="w-full max-w-md md:max-w-lg lg:max-w-xl rounded-md mx-auto mt-14 p-5 overflow-auto bg-white dark:bg-gray-800 dark:text-white"
        >
          {viewNoteModal.data && (
            <>
              <MdClose className="text-gray-600 dark:text-white text-2xl absolute top-4 right-4 cursor-pointer" onClick={closeViewNoteModal} />
              <h2 className="text-xl font-bold mb-2">{viewNoteModal.data.title}</h2>
              <p className="text-sm mb-4">{moment(viewNoteModal.data.createdAt).format("Do MMM YYYY")}</p>
              <p className="mb-4">{viewNoteModal.data.content}</p>
              <div className="text-xs mb-4">
                {viewNoteModal.data.tags.map((tag) => (
                  <span key={tag} className="mr-1">#{tag}</span>
                ))}
              </div>
            </>
          )}
        </Modal> */}


  <Modal
  isOpen={viewNoteModal.isShown}
  onRequestClose={() => setViewNoteModal({ isShown: false, data: null })}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.8)",
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
    </>
  )
}

export default Home
