/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { useEffect, useState } from "react";

import { adminGetCourses, deleteCourseAction, adminGetCourseById } from "../../reduxKit/actions/admin/courseActions";

export default function CoursesList() {
  const dispatch = useDispatch<AppDispatch>();
  const {  loading } = useSelector((state: RootState) => state.course);
    const [courses,setCourses]=useState<any[]>()

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const result = await dispatch(adminGetCourses()).unwrap();
      console.log("the course search results :", result.data); // ✅ actual array
       setCourses(result.data)
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  fetchCourses();
}, [dispatch]);


  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await dispatch(deleteCourseAction(id)).unwrap();
        // Refresh the courses list after deletion
        dispatch(adminGetCourses());
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Error deleting course. Please try again.");
      }
    }
  };

  const handleViewCourse = async (id: string) => {
    try {
      const courseDetails = await dispatch(adminGetCourseById(id)).unwrap();
      console.log("Course details:", courseDetails);
      // You can redirect to course details page or show in modal
      // For now, just logging the details
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("Error fetching course details. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center text-blue-700 tracking-tight">
        Courses
      </h2>
      <div className="mb-4 sm:mb-6 text-right">
        <a
          href="/add-course"
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold shadow hover:bg-blue-700 transition"
        >
          Add New Course
        </a>
      </div>
      
      {courses && courses.length > 0 ? (
        <div className="space-y-6 sm:space-y-8">
          {courses.map((course: any, idx: number) => (
            <div key={course._id || idx} className="border-2 border-blue-100 p-2 sm:p-4 rounded-xl shadow-sm bg-blue-50">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
                {course.imageUrl && (
                  <img
                    src={course.imageUrl}
                    alt="Course Thumbnail"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border shadow mb-2 md:mb-0"
                  />
                )}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-2xl font-bold text-blue-700 mb-1 sm:mb-2">
                      {course.courseName}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewCourse(course._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
                    {course.description}
                  </p>
                  
                  {course.courseNameAr && (
                    <p className="mb-1 sm:mb-2 text-gray-600 text-sm italic">
                      Arabic: {course.courseNameAr}
                    </p>
                  )}
                  
                  {course.descriptionAr && (
                    <p className="mb-1 sm:mb-2 text-gray-600 text-sm italic">
                      Arabic Description: {course.descriptionAr}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span
                      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === "active" 
                          ? "bg-green-200 text-green-800" 
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {course.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    <div>Created: {new Date(course.createdAt).toLocaleDateString()}</div>
                    <div>Updated: {new Date(course.updatedAt).toLocaleDateString()}</div>
                  </div>

                  {/* Show lessons if available (from detailed view) */}
                  {course.lessons && course.lessons.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-blue-600 mb-2 text-sm sm:text-base">
                        Lessons ({course.lessons.length}):
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        {course.lessons.map((lesson: any, lidx: number) => (
                          <li key={lesson._id || lidx} className="bg-white rounded-xl p-2 sm:p-3 shadow">
                            <div className="flex flex-col md:flex-row gap-2 sm:gap-4 items-start">
                              {lesson.thumbnailUrl && (
                                <img
                                  src={lesson.thumbnailUrl}
                                  alt="Lesson Thumbnail"
                                  className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded border mb-2 md:mb-0"
                                />
                              )}
                              <div className="flex-1 w-full">
                                <div className="font-medium text-base sm:text-lg text-blue-700 mb-1">
                                  Lesson #{lesson.lessonNumber}: {lesson.lessonTitle}
                                </div>
                                
                                {lesson.lessonTitleAr && (
                                  <div className="text-sm text-gray-600 italic mb-1">
                                    Arabic: {lesson.lessonTitleAr}
                                  </div>
                                )}
                                
                                <div className="text-xs text-gray-500 space-y-1">
                                  <div>Date: {new Date(lesson.lessonDate).toLocaleDateString()}</div>
                                  <div>Duration: {lesson.lessonDuration}</div>
                                  <div>Created: {new Date(lesson.createdAt).toLocaleDateString()}</div>
                                </div>
                                
                                {lesson.youtubeUrl && (
                                  <div className="text-xs text-blue-600 break-all mt-2">
                                    Video: <a
                                      href={lesson.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline hover:text-blue-800"
                                    >
                                      {lesson.youtubeUrl}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No courses found.</p>
          <p className="text-gray-400 text-sm mt-2">Click "Add New Course" to create your first course.</p>
        </div>
      )}
    </div>
  );
}