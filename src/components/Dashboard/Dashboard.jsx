// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   FaUsers,
//   FaChalkboardTeacher,
//   FaBookOpen,
//   FaLayerGroup,
// } from "react-icons/fa";
// import "./dashboard.css";
// import { api } from "../../api";

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     totalInstructors: 0,
//     totalCourses: 0,
//     totalCategories: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${api}/dashboard`)
//       .then((response) => {
//         if (response.data.status === 1) {
//           setStats(response.data.data);
//         }
//       })
//       .catch((error) => console.error("Error fetching dashboard stats:", error))
//       .finally(() => setLoading(false));
//   }, []);

//   const cards = [
//     {
//       label: "Total Students",
//       value: stats.totalStudents,
//       icon: <FaUsers size={30} />,
//       bg: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
//     },
//     {
//       label: "Total Instructors",
//       value: stats.totalInstructors,
//       icon: <FaChalkboardTeacher size={30} />,
//       bg: "linear-gradient(135deg, #f093fb, #f5576c)",
//     },
//     {
//       label: "Total Courses",
//       value: stats.totalCourses,
//       icon: <FaBookOpen size={30} />,
//       bg: "linear-gradient(135deg, #43e97b, #38f9d7)",
//     },
//     {
//       label: "Total Categories",
//       value: stats.totalCategories,
//       icon: <FaLayerGroup size={30} />,
//       bg: "linear-gradient(135deg, #ffecd2, #fcb69f)",
//     },
//   ];

//   return (
//     <div className="container my-5">
//       {loading ? (
//         <div className="dashboard-loader text-center">
//           <div className="custom-spinner"></div>
//           <p className="mt-3 text-primary fw-semibold fs-5">
//             Loading Dashboard Insights...
//           </p>
//         </div>
//       ) : (
//         <>
//           <h2 className="text-center mb-5 fw-bold text-primary">
//             Admin Dashboard
//           </h2>
//           <div className="row g-4">
//             {cards.map((card, index) => (
//               <div key={index} className="col-md-6 col-xl-3">
//                 <div
//                   className="dashboard-card p-4 text-dark"
//                   style={{ background: card.bg }}
//                 >
//                   <div className="d-flex justify-content-between align-items-center mb-2">
//                     <div className="icon-box">{card.icon}</div>
//                   </div>
//                   <h5 className="fw-semibold">{card.label}</h5>
//                   <h3 className="fw-bold">{card.value}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
  FaLayerGroup,
} from "react-icons/fa";
import "./dashboard.css";
import { api } from "../../api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalCategories: 0,
  });

  const [courseAttendance, setCourseAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the overall stats (students, instructors, courses, categories)
    axios
      .get(`${api}/dashboard`)
      .then((response) => {
        if (response.data.status === 1) {
          setStats(response.data.data);
        }
      })
      .catch((error) =>
        console.error("Error fetching dashboard stats:", error)
      );

    // Fetching the course attendance data
    axios
      .get(`${api}/attendance/course`)
      .then((response) => {
        if (response.data.status === 1) {
          const courseStats = {};

          // Process the course attendance data
          response.data.data.forEach((entry) => {
            const courseName = entry.courseId.name;
            const presentCount = entry.attendance.filter(
              (attendance) => attendance.status === "Present"
            ).length;

            courseStats[courseName] = presentCount;
          });

          setCourseAttendance(courseStats); // Save the course attendance stats
        }
      })
      .catch((error) =>
        console.error("Error fetching course attendance:", error)
      )
      .finally(() => setLoading(false)); // Set loading to false once both requests are done
  }, []);

  const cards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: <FaUsers size={30} />,
      bg: "linear-gradient(135deg, #74ebd5, #ACB6E5)",
    },
    {
      label: "Total Instructors",
      value: stats.totalInstructors,
      icon: <FaChalkboardTeacher size={30} />,
      bg: "linear-gradient(135deg, #f093fb, #f5576c)",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: <FaBookOpen size={30} />,
      bg: "linear-gradient(135deg, #43e97b, #38f9d7)",
    },
    {
      label: "Total Categories",
      value: stats.totalCategories,
      icon: <FaLayerGroup size={30} />,
      bg: "linear-gradient(135deg, #ffecd2, #fcb69f)",
    },
    {
      label: "Course Attendance",
      value: Object.keys(courseAttendance).length,
      icon: <FaBookOpen size={30} />,
      bg: "linear-gradient(135deg, #ff9800, #ff5722)",
    },
  ];

  return (
    <div className="container my-5">
      {loading ? (
        <div className="dashboard-loader text-center">
          <div className="custom-spinner"></div>
          <p className="mt-3 text-primary fw-semibold fs-5">
            Loading Dashboard Insights...
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-center mb-5 fw-bold text-primary">
            Admin Dashboard
          </h2>
          <div className="row g-4">
            {cards.map((card, index) => (
              <div key={index} className="col-md-6 col-xl-3">
                <div
                  className="dashboard-card p-4 text-dark"
                  style={{ background: card.bg }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="icon-box">{card.icon}</div>
                  </div>
                  <h5 className="fw-semibold">{card.label}</h5>
                  <h3 className="fw-bold">
                    {card.label === "Course Attendance" ? (
                      <ul>
                        {Object.entries(courseAttendance).map(
                          ([course, presentCount]) => (
                            <li key={course}>
                              {course}: {presentCount} students present
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      card.value
                    )}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
