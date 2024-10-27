import Note from "../models/notes.js"
import { errorHandler } from "../utils/error.js"

export const addNote=async(req,res,next)=>{
   const {title,content,tags} = req.body;

   const {id} = req.user;

   if(!title){
    return next(errorHandler(400,"Title is required"));
   }

   if(!content){
    return next(errorHandler(400,"Content is required"))
   }

   try{
    const note= new Note({
        title,
        content,
        tags:tags||[],
        userId:id
    })

    await note.save();

    res.status(201).json({
        success:true,
        message:"Note added successfully",
        note,
    })
   }
   catch(error)
   {
    next(error);
   }
}

export const editNote=async(req,res,next)=>{
    const note = await Note.findById(req.params.noteId);

    if(!note){
        return next(errorHandler(404,"Note not found"));
    }

    if(req.user.id !== note.userId){
        return next(errorHandler(401,"You can only update your own note!"))
    }

    const {title,content,tags,isPinned} = req.body;

    if(!title && !content && !tags)
    {
        return next(errorHandler(404,"No changes provided"))
    }

    try{
        if(title){
            note.title=title;
        }

        if(content)
        {
            note.content=content;
        }

        if(tags)
        {
            note.tags=tags;
        }

        if(isPinned)
        {
            note.isPinned=isPinned;
        }

        await note.save();

        res.status(200).json({
            success:true,
            message:"Note updated successfully",
            note
        })
    }
    catch(error){
        next(error);
    }
}

export const getAllNotes=async(req,res,next)=>{
    const userId= req.user.id;

    try{
        const notes= await Note.find({userId:userId}).sort({isPinned:-1})

        res.status(200).json({
            success:true,
            message:"All notes retrived successfully",
            notes,
        })
    }
    catch(error)
    {
        next(error);
    }
}

export const deleteNote=async(req,res,next)=>{
    const noteId= req.params.noteId

    const note=await Note.findOne({_id:noteId,userId:req.user.id})

    if(!note)
    {
        return next(errorHandler(404,"Note not found"))
    }

    try{
        await Note.deleteOne({_id:noteId,userId:req.user.id})

        res.status(200).json({
            success:true,
            message:"Note deleted successfully"
        })
    }
    catch(error)
    {
        next(error);
    }
}

export const updateNotePinned=async(req,res,next)=>{
    try{
        const note = await Note.findById(req.params.noteId)

        if(!note)
        {
            return next(errorHandler(404,"Note not found!"))
        }

        if(req.user.id !== note.userId)
        {
            return next(errorHandler(401,"You can only update your own note!"))
        }

        const {isPinned}=req.body;

        note.isPinned = isPinned;

        await note.save()

        const message = isPinned 
        ? "Pin the note successfully" 
        : "Unpin the note successfully";

        res.status(200).json({
            success:true,
            message,
            note,
        })
    }
    catch(error)
    {
        next(error);
    }
}


export const searchNote = async(req,res,next)=>{
    const {query} = req.query

    if(!query)
    {
        return next(errorHandler(400,"Search query is required"))
    }

    try {
        const matchingNotes = await Note.find({
            userId:req.user.id,
            $or:[
                {title:{$regex:new RegExp(query,'i')}},
                {content:{$regex:new RegExp(query,'i')}},
            ],
        })

        res.status(200).json({
            success:true,
            message:"Notes matching the search query retrieved successfully",
            notes:matchingNotes,
        })
    } catch (error) {
        next(error);
    }
}

export const updatefavNote=async(req,res,next)=>{
    try{
        const note = await Note.findById(req.params.noteId)

        if(!note)
        {
            return next(errorHandler(404,"Fav-note not found!"))
        }

        if(req.user.id !== note.userId)
        {
            return next(errorHandler(401,"You can view only your own fav-note!"))
        }

        const {isFav}=req.body;

        note.isFav = isFav;

        await note.save()

        const message = isFav 
            ? "Favorite note added successfully" 
            : "Favorite note removed successfully";

        res.status(200).json({
            success:true,
            message,
            note,
        })
    }
    catch(error)
    {
        next(error);
    }
}

export const favNotes=async(req,res,next)=>{
    const userId = req.user.id;
    try{
        // const Fav_notes= await Note.findById({noteId}).populate({
        //    path:"imp_note",
        //    match:{isFav:true},
        //    option:{sort:{createdAt:-1}},

        // });

        const favNotes = await Note.find({
            userId: userId, // Ensure the notes belong to the current user
            isFav: true, // Only get the favorite notes
        }).sort({ createdAt: -1 }); // Sort by the creation date, most recent first

        // If no favorite notes are found
        if (!favNotes || favNotes.length === 0) {
            return next(errorHandler(404, "No favorite notes found!"));
        }
        

        
        console.log(favNotes);
        res.status(200).json({
            success:true,
            message:"Favorite notes retrived successfully",
            note:favNotes,
        })
    }
    catch(error)
    {
        next(error);
    }
}