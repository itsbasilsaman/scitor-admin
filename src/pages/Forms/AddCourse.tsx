
import { useState, ChangeEvent, FormEvent } from "react";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";


type LessonContent = {
  videoUrl: string;
  videoDuration: string;
  resources: File[];
  preview: boolean;
};

type Lesson = {
  title: string;
  id: string;
  date: string;
  instructor: string;
  thumbnail: File | null;
  duration: string;
  content: LessonContent;
};

type Course = {
  title: string;
  description: string;
  thumbnail: File | null;
  status: string;
  lessons: Lesson[];
};

const initialCourse: Course = {
  title: "",
  description: "",
  thumbnail: null,
  status: "Active",
  lessons: [],
};

const initialLesson: Lesson = {
  title: "",
  id: "",
  date: "",
  instructor: "",
  thumbnail: null,
  duration: "",
  content: {
    videoUrl: "",
    videoDuration: "",
    resources: [],
    preview: false,
  },
};

export default function AddCourse() {
  const [step, setStep] = useState<number>(1);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course>(initialCourse);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(initialLesson);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseThumbPreview, setCourseThumbPreview] = useState<string | null>(null);
  const [lessonThumbPreview, setLessonThumbPreview] = useState<string | null>(null);

  // Handlers for course fields
  const handleCourseChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "thumbnail" && files && files[0]) {
      setCourse((prev) => ({ ...prev, thumbnail: files[0] }));
      setCourseThumbPreview(URL.createObjectURL(files[0]));
    } else {
      setCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handlers for lesson fields
  const handleLessonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "thumbnail" && files && files[0]) {
      setCurrentLesson((prev) => ({ ...prev, thumbnail: files[0] }));
      setLessonThumbPreview(URL.createObjectURL(files[0]));
    } else {
      setCurrentLesson((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Add lesson to list
  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      { ...currentLesson, id: `L${prev.length + 1}` }
    ]);
    setCurrentLesson(initialLesson);
  };

  // Save course with lessons
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would send course + lessons data to backend
    alert("Course created! Check console for data.");
    console.log({ ...course, lessons });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 tracking-tight">Add New Course</h2>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {[1,2,3].map((s) => (
          <button
            key={s}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm focus:outline-none ${step === s ? "bg-blue-600 text-white scale-105" : "bg-gray-200 text-gray-700 hover:bg-blue-100"}`}
            onClick={() => setStep(s)}
          >
            {s === 1 ? "Course Info" : s === 2 ? "Course Details" : "Course Content"}
          </button>
        ))}
        <button
          className="px-5 py-2 rounded-full font-semibold bg-purple-600 text-white shadow hover:bg-purple-700 transition ml-4"
          onClick={() => navigate("/courses")}
        >
          View All Courses
        </button>
      </div>

      <Transition
        show={step === 1}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6 animate-fade-in">
          <div>
            <label className="block mb-2 font-semibold text-blue-700">Course Title</label>
            <input type="text" name="title" value={course.title} onChange={handleCourseChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" required />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-blue-700">Short Description</label>
            <textarea name="description" value={course.description} onChange={handleCourseChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" required />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-blue-700">Thumbnail Image</label>
            <input type="file" name="thumbnail" accept="image/*" onChange={handleCourseChange} className="w-full" />
            {courseThumbPreview && (
              <img src={courseThumbPreview} alt="Course Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border shadow" />
            )}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-blue-700">Status</label>
            <select name="status" value={course.status} onChange={handleCourseChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Next: Add Lessons</button>
        </form>
      </Transition>

      <Transition
        show={step === 2}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">Add Lessons/Classes</h3>
          <form onSubmit={(e) => { e.preventDefault(); addLesson(); }} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-blue-700">Lesson Title</label>
              <input type="text" name="title" value={currentLesson.title} onChange={handleLessonChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" required />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-700">Lesson Date</label>
              <input type="date" name="date" value={currentLesson.date} onChange={handleLessonChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" required />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-700">Instructor Name</label>
              <input type="text" name="instructor" value={currentLesson.instructor} onChange={handleLessonChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" required />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-700">Lesson Thumbnail Image</label>
              <input type="file" name="thumbnail" accept="image/*" onChange={handleLessonChange} className="w-full" />
              {lessonThumbPreview && (
                <img src={lessonThumbPreview} alt="Lesson Thumbnail Preview" className="mt-2 w-24 h-24 object-cover rounded-lg border shadow" />
              )}
            </div>
            <div>
              <label className="block mb-2 font-semibold text-blue-700">Lesson Duration</label>
              <input type="text" name="duration" value={currentLesson.duration} onChange={handleLessonChange} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" placeholder="e.g. 45 min" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Add Lesson</button>
          </form>
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-blue-700">Lessons Added:</h4>
            <ul className="space-y-2">
              {lessons.map((lesson, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-blue-50 rounded-lg p-2 shadow-sm">
                  {lesson.thumbnail && (
                    <img src={URL.createObjectURL(lesson.thumbnail)} alt="Lesson Thumb" className="w-10 h-10 object-cover rounded" />
                  )}
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-xs text-gray-500">(ID: {lesson.id})</span>
                  <span className="text-xs text-gray-500">{lesson.date}</span>
                  <span className="text-xs text-gray-500">{lesson.instructor}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { setCourse((prev) => ({ ...prev, lessons })); setStep(3); }} className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform mt-6">Next: Add Content</button>
        </div>
      </Transition>

      <Transition
        show={step === 3}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-blue-700">Course Details for Each Lesson</h3>
          {lessons.length === 0 ? (
            <p className="text-red-500">No lessons added. Go back and add lessons first.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {lessons.map((lesson, idx) => (
                <div key={idx} className="border-2 border-blue-100 p-4 mb-4 rounded-xl shadow-sm bg-white">
                  <h4 className="font-bold mb-2 text-blue-600">{lesson.title} <span className="text-xs text-gray-400">(ID: {lesson.id})</span></h4>
                  <div className="mb-2">
                    <label className="block mb-1 font-semibold text-blue-700">Video URL</label>
                    <input type="url" name="videoUrl" value={lesson.content.videoUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[idx] = {
                        ...updatedLessons[idx],
                        content: {
                          ...updatedLessons[idx].content,
                          videoUrl: e.target.value,
                        },
                      };
                      setLessons(updatedLessons);
                    }} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" />
                  </div>
                  {/* Course Detail fields below URL */}
                  <div className="mb-2">
                    <label className="block mb-1 font-semibold text-blue-700">Video Duration</label>
                    <input type="text" name="videoDuration" value={lesson.content.videoDuration} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[idx] = {
                        ...updatedLessons[idx],
                        content: {
                          ...updatedLessons[idx].content,
                          videoDuration: e.target.value,
                        },
                      };
                      setLessons(updatedLessons);
                    }} className="w-full border-2 border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all" placeholder="e.g. 1:30:00" />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 font-semibold text-blue-700">Additional Resources</label>
                    <input type="file" name="resources" multiple onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[idx] = {
                        ...updatedLessons[idx],
                        content: {
                          ...updatedLessons[idx].content,
                          resources: e.target.files ? Array.from(e.target.files) : [],
                        },
                      };
                      setLessons(updatedLessons);
                    }} className="w-full" />
                    {lesson.content.resources && lesson.content.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {lesson.content.resources.map((file, fidx) => (
                          file.type.startsWith("image/") ? (
                            <img key={fidx} src={URL.createObjectURL(file)} alt="Resource Preview" className="w-16 h-16 object-cover rounded border" />
                          ) : (
                            <span key={fidx} className="px-2 py-1 bg-gray-100 rounded text-xs">{file.name}</span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-2 flex items-center">
                    <input type="checkbox" name="preview" checked={lesson.content.preview} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const updatedLessons = [...lessons];
                      updatedLessons[idx] = {
                        ...updatedLessons[idx],
                        content: {
                          ...updatedLessons[idx].content,
                          preview: e.target.checked,
                        },
                      };
                      setLessons(updatedLessons);
                    }} className="mr-2" />
                    <label className="font-semibold text-blue-700">Allow Free Preview</label>
                  </div>
                </div>
              ))}
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowPreview(true)} className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Show Preview</button>
                <button type="submit" className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">Create Course</button>
              </div>
            </form>
          )}
          {/* Preview Modal */}
          {showPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-lg relative animate-fade-in">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setShowPreview(false)}>&times;</button>
                <h3 className="text-xl font-bold mb-4 text-blue-700">Course Preview</h3>
                <div className="mb-2">
                  <span className="font-semibold">Title:</span> {course.title}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Description:</span> {course.description}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> {course.status}
                </div>
                {courseThumbPreview && (
                  <img src={courseThumbPreview} alt="Course Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border shadow" />
                )}
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-blue-700">Lessons:</h4>
                  <ul className="space-y-2">
                    {lessons.map((lesson, idx) => (
                      <li key={idx} className="flex flex-col gap-1 bg-blue-50 rounded-lg p-2 shadow-sm">
                        <span className="font-medium">{lesson.title}</span>
                        <span className="text-xs text-gray-500">Date: {lesson.date}</span>
                        <span className="text-xs text-gray-500">Instructor: {lesson.instructor}</span>
                        <span className="text-xs text-gray-500">Duration: {lesson.duration}</span>
                        <span className="text-xs text-blue-600">Video: <a href={lesson.content.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">{lesson.content.videoUrl}</a></span>
                        <span className="text-xs text-gray-500">Video Duration: {lesson.content.videoDuration}</span>
                        {lesson.content.preview && <span className="text-xs text-green-600">Preview Available</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
}
