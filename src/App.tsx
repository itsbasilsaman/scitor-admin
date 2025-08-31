import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useSelector } from "react-redux";
import { RootState } from "./reduxKit/store";

import AddCourse from "./pages/course/AddCourse";
import CoursesList from "./pages/course/CoursesList";
import SignIn from "./pages/AuthPages/SignIn";

import NotFound from "./pages/OtherPage/NotFound";

export const App: React.FC = React.memo(() => {
  const { isLogged, role } = useSelector((state: RootState) => state.auth);
  console.log("Logged & Role:-", isLogged, role);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
                  <Route element={<AppLayout />}></Route>
        <Route
          path="/"
          element={
            isLogged && role === "admin" ? <Navigate to="/adminHomepage" /> : <SignIn />
          }
        />
        <Route
          path="/add-course"
          element={isLogged && role === "admin" ? <AddCourse /> : <SignIn />}
        />
        <Route
          path="/courses"
          element={isLogged && role === "admin" ? <CoursesList /> : <SignIn />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
});

export default App; // ✅ important
