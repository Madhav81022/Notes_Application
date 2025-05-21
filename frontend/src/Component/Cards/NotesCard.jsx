
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import moment from "moment"
import { ThemeContext } from "../../contexts/theme"; // Import ThemeProvider
import { useContext } from "react";


const NotesCard = ({title,date,content,tags,isPinned,onPinNote,onEdit,onDelete,onFavNote,isFav,onView}) => {

  const {theme} = useContext(ThemeContext);

  return (

    <div className={`border rounded p-4 ${theme === 'dark' ? 'bg-gray-800 text-white shadow-lg hover:shadow-gray-500/30' : 'bg-white text-black shadow-md hover:shadow-lg'} 
    hover:drop-shadow-lg transition-shadow ease-in-out duration-300`}
    onClick={onView}
    >
      <div className="flex items-center justify-between ">
        <div >
            <h6 className="text-sm font-medium">{title}</h6>
            <span className=" text-xs ">{moment(date).format("Do MMM YYYY")}</span>
        </div>
      
        <div className="flex items-center gap-2">
        <div className="relative group">
        <MdOutlinePushPin
              className={`icon-btn ${ isPinned ? "text-[#2B85FF]" : "text-slate-300"
            }`}
           onClick={ (e)=>{
            e.stopPropagation();
            onPinNote()
           }} 
         />
            {/* Tooltip */}
             <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-600 text-white border-white' : 'bg-gray-200 text-gray-800 border-gray-900'} text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}>
              Pin
            </span>
          </div>

          <div className="relative group">
         <button onClick={(e)=>{
          e.stopPropagation();
          onFavNote();
         }}>
           {isFav?<FaHeart className=" text-red-600"/>:<CiHeart/>}
         </button>
         {/* Tooltip */}
         <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-600 text-white border-white' : 'bg-gray-200 text-gray-800 border-gray-900'} text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}>
         {isFav ? "Favorite" : "Unfavorite"}
            </span>
          </div>
        </div>
       
      </div>  
      <p className="text-xs  mt-2">
       {content?.slice(0,60)}
      </p>
       
      <div className=" flex items-center justify-between mt-2">
        <div className=" text-xs ">
            {tags.map((item)=>` #${item} `)}
        </div>

        <div className="flex items-center gap-2">
        <div className="relative group">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={
              (e)=>{
          e.stopPropagation();
          onEdit();}}
          />

          {/* Tooltip */}
          <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-600 text-white border-white' : 'bg-gray-200 text-gray-800 border-gray-900'} text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}>
              Edit
            </span>
          </div>

          <div className="relative group">
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={
              (e)=>{
                e.stopPropagation();
              onDelete();}}
          />

          {/* Tooltip */}
          <span className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs ${theme === 'dark' ? 'bg-gray-600 text-white border-white' : 'bg-gray-200 text-gray-800 border-gray-900'} text-white rounded-md border border-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200`}>
              Delete
            </span>
          </div>
        </div>
      </div> 

    </div>
   
  )
}

export default NotesCard