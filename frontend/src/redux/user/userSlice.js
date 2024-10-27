import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    errorDispatch:null,
    loading:false,
}

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{
        signInState:(state)=>{
            state.loading=true
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload,
            state.loading=false,
            state.errorDispatch=null
        },
        signInFailure:(state,action)=>{
            state.errorDispatch=action.payload,
            state.loading=false
        },
        signoutStart:(state)=>{
            state.loading=true
        },
        signoutSuccess:(state)=>{
            state.currentUser=null,
            state.loading=false,
            state.errorDispatch=null
        },
        signoutFailure:(state,action)=>{
            state.errorDispatch=action.payload,
            state.loading=false
        },
    },
})

export const {signInFailure,signInState,signInSuccess,signoutSuccess,signoutFailure,signoutStart}=userSlice.actions

export default userSlice.reducer