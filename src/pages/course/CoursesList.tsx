/* eslint-disable @typescript-eslint/no-explicit-any */

// import { Link } from "react-router-dom";
 
type Resource = string | { name: string };


const courses: {
  title: string;
  description: string;
  status: string;
  thumbnail: string;
  lessons: Array<{
    title: string;
    date: string;
    instructor: string;
    duration: string;
    thumbnail: string;
    content: {
      videoUrl: string;
      videoDuration: string;
      resources: Resource[];
      preview: boolean;
    };
  }>;
}[] = [
  {
    title: "React Basics",
    description: "Learn the basics of React.",
    status: "Active",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    lessons: [
      {
        title: "Introduction",
        date: "2025-08-30",
        instructor: "John Doe",
        duration: "45 min",
        thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/example",
          videoDuration: "45:00",
          resources: [],
          preview: true,
        },
      },
    ],
  },
  {
    title: "Advanced JavaScript",
    description: "Deep dive into JavaScript ES6+ features.",
    status: "Inactive",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    lessons: [
      {
        title: "ES6 Syntax",
        date: "2025-09-01",
        instructor: "Jane Smith",
        duration: "60 min",
        thumbnail: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/js-es6",
          videoDuration: "60:00",
          resources: [],
          preview: false,
        },
      },
      {
        title: "Async/Await",
        date: "2025-09-02",
        instructor: "Jane Smith",
        duration: "50 min",
        thumbnail: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/js-async",
          videoDuration: "50:00",
          resources: [],
          preview: true,
        },
      },
    ],
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of UI/UX design.",
    status: "Active",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    lessons: [
      {
        title: "Color Theory",
        date: "2025-09-05",
        instructor: "Alex Lee",
        duration: "40 min",
        thumbnail: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/ui-color",
          videoDuration: "40:00",
          resources: [],
          preview: false,
        },
      },
      {
        title: "Typography",
        date: "2025-09-06",
        instructor: "Alex Lee",
        duration: "35 min",
        thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/ui-typography",
          videoDuration: "35:00",
          resources: [],
          preview: true,
        },
      },
    ],
  },
  {
    title: "Python for Data Science",
    description: "Learn Python and its libraries for data science.",
    status: "Active",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8f9?auto=format&fit=crop&w=400&q=80",
    lessons: [
      {
        title: "NumPy Basics",
        date: "2025-09-10",
        instructor: "Sara Kim",
        duration: "55 min",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/numpy-basics",
          videoDuration: "55:00",
          resources: [],
          preview: true,
        },
      },
      {
        title: "Pandas DataFrames",
        date: "2025-09-11",
        instructor: "Sara Kim",
        duration: "50 min",
        thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80",
        content: {
          videoUrl: "https://youtube.com/pandas-dataframes",
          videoDuration: "50:00",
          resources: [],
          preview: false,
        },
      },
    ],
  }, 
];

export default function CoursesList() {
   
  
  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center text-blue-700 tracking-tight">Courses</h2>
      <div className="mb-4 sm:mb-6 text-right">
        <a href="/add-course" className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold shadow hover:bg-blue-700 transition">Add New Course</a>
      </div>
      <div className="space-y-6 sm:space-y-8">
        {courses.map((course, idx) => (
          <div key={idx} className="border-2 border-blue-100 p-2 sm:p-4 rounded-xl shadow-sm bg-blue-50">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
              {course.thumbnail && (
                <img src={course.thumbnail} alt="Course Thumbnail" className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border shadow mb-2 md:mb-0" />
              )}
              <div className="flex-1 w-full">
                <h3 className="text-lg sm:text-2xl font-bold text-blue-700 mb-1 sm:mb-2">{course.title}</h3>
                <p className="mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">{course.description}</p>
                <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold mb-2 ${course.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{course.status}</span>
                <div className="mt-2">
                  <h4 className="font-semibold text-blue-600 mb-1 sm:mb-2 text-sm sm:text-base">Lessons:</h4>
                  <ul className="space-y-3 sm:space-y-4">
                    {course.lessons.map((lesson, lidx) => (
                      <li key={lidx} className="bg-white rounded-xl p-2 sm:p-3 shadow flex flex-col md:flex-row gap-2 sm:gap-4 items-center w-full">
                        {lesson.thumbnail && (
                          <img src={lesson.thumbnail} alt="Lesson Thumbnail" className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded border mb-2 md:mb-0" />
                        )}
                        <div className="flex-1 w-full">
                          <span className="font-medium text-base sm:text-lg text-blue-700">{lesson.title}</span>
                          <div className="text-xs text-gray-500">Date: {lesson.date}</div>
                          <div className="text-xs text-gray-500">Instructor: {lesson.instructor}</div>
                          <div className="text-xs text-gray-500">Duration: {lesson.duration}</div>
                          <div className="text-xs text-blue-600 break-all">Video: <a href={lesson.content.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">{lesson.content.videoUrl}</a></div>
                          <div className="text-xs text-gray-500">Video Duration: {lesson.content.videoDuration}</div>
                          {lesson.content.resources && lesson.content.resources.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {lesson.content.resources.map((file, fidx) => {
                                if (typeof file === "string") {
                                  return file.startsWith("http") ? (
                                    <img key={fidx} src={file} alt="Resource Preview" className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded border" />
                                  ) : (
                                    <span key={fidx} className="px-2 py-1 bg-gray-100 rounded text-xs">{file}</span>
                                  );
                                } else {
                                  return <span key={fidx} className="px-2 py-1 bg-gray-100 rounded text-xs">{file.name}</span>;
                                }
                              })}
                            </div>
                          )}
                          {lesson.content.preview && <span className="text-xs text-green-600">Preview Available</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
