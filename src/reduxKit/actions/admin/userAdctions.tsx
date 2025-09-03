import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });




  export const adminAddUserAction= createAsyncThunk(
    "admin/addUser",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this user for add  ",Datas);
            const response = await axiosIn.post(`/admin/addUser`, Datas,config);
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.response) {
              return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: "Something went wrong!" });
          }
    }
  )


    export const adminGetUsers= createAsyncThunk(
      "admin/adminGetUsers",
      async (_,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getUsers`,config);
              return response.data;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
              if (error.response) {
                return rejectWithValue(error.response.data);
              }
              return rejectWithValue({ message: "Something went wrong!" });
            }
      }
    )
  
      export const deleteUserAction= createAsyncThunk(
        "admin/deleteUserAction",
        async (id:string,{rejectWithValue})=>{
            try {
                console.log("before delete the deleteUserAction ",id);
                const response = await axiosIn.delete(`/admin/deleteUser/${id}`,config);
                return response.data;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                if (error.response) {
                  return rejectWithValue(error.response.data);
                }
                return rejectWithValue({ message: "Something went wrong!" });
              }
        }
      )
    
    
    