/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { useEffect, useState } from "react";

import { adminGetCourses, deleteLessonAction, adminGetCourseById } from "../../reduxKit/actions/admin/courseActions";
import toast from "react-hot-toast";

export default function CoursesList() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.course);
  const [courses, setCourses] = useState<any[]>();
  const [detailedCourses, setDetailedCourses] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await dispatch(adminGetCourses()).unwrap();
        console.log("the course search results :", result.data);
        setCourses(result.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, [dispatch]);

  const deleteLessonfunction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response= await dispatch(deleteLessonAction(id)).unwrap();

        console.log("the course delete api :",response);
        if(response.success){
    toast.success(response.message)
        }
        // Refresh the courses list after deletion
        const result = await dispatch(adminGetCourses()).unwrap();
        setCourses(result.data);
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Error deleting course. Please try again.");
      }
    }
  };

  
  const handleViewCourse = async (id: string) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      console.log("before going to the course details ", id);

      const courseDetails = await dispatch(adminGetCourseById(id)).unwrap();
      console.log("Course details:", courseDetails);
      if (courseDetails.success) {
        setDetailedCourses(courseDetails.data);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("Error fetching course details. Please try again.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDetailedCourses(null);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <>
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

      {/* Modal for Course Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-blue-700">
                  {modalLoading ? "Loading..." : "Course Details"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading course details...</p>
                </div>
              ) : detailedCourses ? (
                <div className="space-y-6">
                  {/* Course Information */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {detailedCourses.imageUrl && (
                        <img
                          src={detailedCourses.imageUrl}
                          alt="Course Thumbnail"
                          className="w-full md:w-48 h-48 object-cover rounded-lg border shadow"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-blue-700 mb-2">
                          {detailedCourses.courseName}
                        </h4>
                        {detailedCourses.courseNameAr && (
                          <p className="text-lg text-gray-600 italic mb-2">
                            Arabic: {detailedCourses.courseNameAr}
                          </p>
                        )}
                        <p className="text-gray-700 mb-4">{detailedCourses.description}</p>
                        {detailedCourses.descriptionAr && (
                          <p className="text-gray-600 italic mb-4">
                            Arabic Description: {detailedCourses.descriptionAr}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              detailedCourses.status === "active"
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {detailedCourses.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          <div>Created: {new Date(detailedCourses.createdAt).toLocaleDateString()}</div>
                          <div>Updated: {new Date(detailedCourses.updatedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons Section */}
                  {detailedCourses.lessons && detailedCourses.lessons.length > 0 && (
                    <div>

                      <div className="flex justify-between p-1">                       <h4 className="text-xl font-bold text-blue-700 mb-4">
                        Lessons ({detailedCourses.lessons.length})
                      </h4>
                       </div>

                      <div className="space-y-4">
                        {detailedCourses.lessons.map((lesson: any, index: number) => (
                          <div
                            key={lesson._id || index}
                            className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col lg:flex-row gap-4">
                              {lesson.thumbnailUrl && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={lesson.thumbnailUrl}
                                    alt={`Lesson ${lesson.lessonNumber} Thumbnail`}
                                    className="w-full lg:w-32 h-20 lg:h-24 object-cover rounded-lg border"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                                  <h5 className="text-lg font-semibold text-blue-600">
                                    Lesson #{lesson.lessonNumber}: {lesson.lessonTitle}
                                  </h5>
                                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-1 sm:mt-0">
                                    {lesson.lessonDuration}
                                  </span>
                                </div>

                                {lesson.lessonTitleAr && (
                                  <p className="text-gray-600 italic text-sm mb-2">
                                    Arabic: {lesson.lessonTitleAr}
                                  </p>
                                )}
                                

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                                  <div>Date: {new Date(lesson.lessonDate).toLocaleDateString()}</div>
                                  <div>Created: {new Date(lesson.createdAt).toLocaleDateString()}</div>
                                
                                </div>

                                {lesson.youtubeUrl && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Video URL:</p>
                                    <a
                                      href={lesson.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                      </svg>
                                      Watch Video
                                    </a>
                                      <div className="w-full flex justify-end"><button
                          onClick={() => deleteLessonfunction(lesson?._id)}
                          className="bg-red-600 text-white px-2  rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button></div>
                                  </div>
                                  

                                  
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!detailedCourses.lessons || detailedCourses.lessons.length === 0) && (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No lessons found for this course.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No course details available.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}