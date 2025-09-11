/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetCourses } from '../../reduxKit/actions/admin/courseActions';
import { adminAddLessonAction } from '../../reduxKit/actions/admin/adminLessonAction';
import { AppDispatch, RootState } from '../../reduxKit/store';

interface Course {
  _id: string;
  courseName: string;
}

interface LessonFormData {
  courseId: string;
  lessonTitle: string;
  lessonTitleAr: string;
  lessonNumber: string;
  lessonDate: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  lessonDuration: string;
}

const AddLesson: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {  loading: coursesLoading } = useSelector((state: RootState) => state.course);
  const { loading: lessonLoading } = useSelector((state: RootState) => state.lesson);
  const [courses,setCourses]=useState<any[]>()

  const [formData, setFormData] = useState<LessonFormData>({
    courseId: '',
    lessonTitle: '',
    lessonTitleAr: '',
    lessonNumber: '',
    lessonDate: '',
    youtubeUrl: '',
    thumbnailUrl: '', 
    lessonDuration: ''
  });

  const [errors, setErrors] = useState<Partial<LessonFormData>>({});

  // Fetch courses on component mount
useEffect(() => {
  const fetchCourses = async () => {
    try {
      const result = await dispatch(adminGetCourses()).unwrap();
      console.log("payload data only: ", result.data); 
      setCourses(result.data)
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  fetchCourses();
}, [dispatch]);

  // Helper to extract YouTube video ID from any valid YouTube URL
  const extractYouTubeVideoId = (url: string): string => {
    // Regex covers youtu.be, youtube.com/watch, youtube.com/embed, with or without extra params
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'youtubeUrl') {
      newValue = extractYouTubeVideoId(value.trim());
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    // Clear error when user starts typing
    if (errors[name as keyof LessonFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LessonFormData> = {};

    if (!formData.courseId) newErrors.courseId = 'Course selection is required';
    if (!formData.lessonTitle.trim()) newErrors.lessonTitle = 'Lesson title is required';
    if (!formData.lessonTitleAr.trim()) newErrors.lessonTitleAr = 'Arabic lesson title is required';
    if (!formData.lessonNumber.trim()) newErrors.lessonNumber = 'Lesson number is required';
    if (!formData.lessonDate) newErrors.lessonDate = 'Lesson date is required';
    if (!formData.youtubeUrl.trim()) newErrors.youtubeUrl = 'YouTube URL is required';
    if (!formData.lessonDuration.trim()) newErrors.lessonDuration = 'Lesson duration is required';
    if (!formData.thumbnailUrl.trim()) newErrors.thumbnailUrl = 'Thumbnail URL is required';

    // Validate lesson number is positive
    if (formData.lessonNumber && (isNaN(Number(formData.lessonNumber)) || Number(formData.lessonNumber) <= 0)) {
      newErrors.lessonNumber = 'Lesson number must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('courseId', formData.courseId);
    formDataToSend.append('lessonTitle', formData.lessonTitle);
    formDataToSend.append('lessonTitleAr', formData.lessonTitleAr);
    formDataToSend.append('lessonNumber', formData.lessonNumber);
    formDataToSend.append('lessonDate', formData.lessonDate);
    formDataToSend.append('youtubeUrl', formData.youtubeUrl);
    formDataToSend.append('thumbnailUrl', formData.thumbnailUrl);
    formDataToSend.append('lessonDuration', formData.lessonDuration);

    try {
        console.log("before going to the lesson : ",);
        
      await dispatch(adminAddLessonAction(formDataToSend)).unwrap();
      // Reset form on success
      setFormData({
        courseId: '',
        lessonTitle: '',
        lessonTitleAr: '',
        lessonNumber: '',
        lessonDate: '',
        youtubeUrl: '',
        thumbnailUrl: '',
        lessonDuration: ''
      });
      alert('Lesson added successfully!');
    } catch (error) {
      console.error('Error adding lesson:', error);
      alert('Error adding lesson. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      lessonTitle: '',
      lessonTitleAr: '',
      lessonNumber: '',
      lessonDate: '',
      youtubeUrl: '',
      thumbnailUrl: '',
      lessonDuration: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Lesson</h1>
          <p className="text-gray-600">Create a new lesson and assign it to a course</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.courseId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={coursesLoading}
                >
                  <option value="">
                    {coursesLoading ? 'Loading courses...' : 'Select a course'}
                  </option>
                  {courses?.map((course: Course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
              </div>

              <div>
                <label htmlFor="lessonNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Number *
                </label>
                <input
                  type="number"
                  id="lessonNumber"
                  name="lessonNumber"
                  value={formData.lessonNumber}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lessonNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter lesson number"
                />
                {errors.lessonNumber && <p className="text-red-500 text-sm mt-1">{errors.lessonNumber}</p>}
              </div>
            </div>

            {/* Lesson Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lessonTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title (English) *
                </label>
                <input
                  type="text"
                  id="lessonTitle"
                  name="lessonTitle"
                  value={formData.lessonTitle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lessonTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter lesson title in English"
                />
                {errors.lessonTitle && <p className="text-red-500 text-sm mt-1">{errors.lessonTitle}</p>}
              </div>

              <div>
                <label htmlFor="lessonTitleAr" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title (Arabic) *
                </label>
                <input
                  type="text"
                  id="lessonTitleAr"
                  name="lessonTitleAr"
                  value={formData.lessonTitleAr}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lessonTitleAr ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل عنوان الدرس بالعربية"
                  dir="rtl"
                />
                {errors.lessonTitleAr && <p className="text-red-500 text-sm mt-1">{errors.lessonTitleAr}</p>}
              </div>
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="lessonDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Date *
                </label>
                <input
                  type="date"
                  id="lessonDate"
                  name="lessonDate"
                  value={formData.lessonDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lessonDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lessonDate && <p className="text-red-500 text-sm mt-1">{errors.lessonDate}</p>}
              </div>

              <div>
                <label htmlFor="lessonDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Duration *
                </label>
                <input
                  type="text"
                  id="lessonDuration"
                  name="lessonDuration"
                  value={formData.lessonDuration}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lessonDuration ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 45 minutes, 1 hour 30 minutes"
                />
                {errors.lessonDuration && <p className="text-red-500 text-sm mt-1">{errors.lessonDuration}</p>}
              </div>
            </div>

            {/* YouTube URL */}
            <div>
              <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.youtubeUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.youtubeUrl && <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl}</p>}
            </div>

            {/* Thumbnail URL */}
            <div>
              <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL *
              </label>
              <input
                type="url"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.thumbnailUrl ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://example.com/thumbnail.jpg"
              />
              {errors.thumbnailUrl && <p className="text-red-500 text-sm mt-1">{errors.thumbnailUrl}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={lessonLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {lessonLoading ? 'Adding Lesson...' : 'Add Lesson'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;