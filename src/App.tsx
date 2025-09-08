import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "./reduxKit/store";
import { Toaster } from 'react-hot-toast';

import AddUserForm from "./pages/Users/addUser";
import AddCourse from "./pages/course/AddCourse";
import CoursesList from "./pages/course/CoursesList";
import SignIn from "./pages/AuthPages/SignIn";
import AddLesson from "./pages/course/AddLessonCourse";

import NotFound from "./pages/OtherPage/NotFound";
import UserList from "./pages/Users/userList";

export const App: React.FC = React.memo(() => {
  const { isLogged, role } = useSelector((state: RootState) => state.auth);
  console.log("Logged & Role:-", isLogged, role);

  return (
    <Router>
      <ScrollToTop />
         <Toaster position="top-center" />


      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<SignIn />} />

        {/* Protected Routes inside AppLayout */}
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={isLogged ? <CoursesList /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-course"
            element={isLogged ? <AddCourse /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-lesson"
            element={isLogged ? <AddLesson /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-user"
            element={isLogged ? <AddUserForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses"
            element={isLogged ? <CoursesList /> : <Navigate to="/login" />}
          />
          <Route
            path="/users-list"
            element={isLogged ? <UserList /> : <Navigate to="/login" />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
});

export default App;
