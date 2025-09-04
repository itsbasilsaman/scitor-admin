import axios  from "axios";
import { URL,config } from "../../../config/constants";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const axiosIn = axios.create({
    baseURL: URL,
  });



  export const adminAddLessonAction= createAsyncThunk(
    "admin/Lesson",
    async (Datas:FormData,{rejectWithValue})=>{
        try {
            console.log("this  for Lesson ",Datas);
            const response = await axiosIn.post(`/admin/addLesson`, Datas,config);
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


    export const adminGetLessons= createAsyncThunk(
      "admin/adminGetLessons",
      async (_,{rejectWithValue})=>{
          try {
              const response = await axiosIn.get(`/admin/getLessons`,config);
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
  
      export const deleteLessonAction= createAsyncThunk(
        "admin/deleteUserAction",
        async (id:string,{rejectWithValue})=>{
            try {
                console.log("before delete the LessonAction ",id);
                const response = await axiosIn.delete(`/admin/deleteLesson/${id}`,config);
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
    
    
    