import { createRoot } from "react-dom/client";
import "./assets/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Courses from "./components/Course/Courses.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import StudentTable from "./components/Student/StudentTable.jsx";
import StudentProgress from "./components/StudentProgress/StudentProgress.jsx";
import TeacherTable from "./components/Teacher/TeacherTable.jsx";
import Enrollment from "./components/StudentEnrollment/Enrollment.jsx";
import SignIn from "./components/SignIn/SignIn.jsx";
import Categories from "./components/Categories/Categories.jsx";
// import Request from "./components/PendingRequest/Request.jsx";
import Ratings from "./components/RatingReview/Ratings.jsx";
import AdminRequests from "./components/PendingRequest/AdminRequests.jsx";
import FeeManagement from "./components/FeeManagement/FeeManagement.jsx";
import Attendance from "./components/Attendance/Attendance.jsx";
import Banner from "./components/Banners/Banner.jsx";
import StudentProfile from "./components/StudentProfile/StudentProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/Courses", element: <Courses /> },
      { path: "/categories", element: <Categories /> },
      { path: "/ratings", element: <Ratings /> },
      { path: "/students", element: <StudentTable /> },
      { path: "/studentprofile", element: <StudentProfile /> },
      { path: "/progress-tracking", element: <StudentProgress /> },
      { path: "/teachers", element: <TeacherTable /> },
      { path: "/enrollments", element: <Enrollment /> },
      { path: "/banner", element: <Banner /> },
      { path: "/pendingrequest", element: <AdminRequests /> },
      { path: "/feemanagement", element: <FeeManagement /> },
      { path: "/attendance", element: <Attendance /> },
    ],
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
);
