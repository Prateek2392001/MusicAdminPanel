import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Enrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    axios
      .get("https://freetestapi.com/api/v1/enrollments")
      .then((response) => setEnrollments(response.data))
      .catch((error) =>
        console.error("Error fetching enrollment data:", error)
      );
  }, []);

  const toggleCourse = (courseName) => {
    setExpandedCourse(expandedCourse === courseName ? null : courseName);
  };

  const groupedEnrollments = enrollments.reduce((acc, student) => {
    if (!acc[student.courseName]) {
      acc[student.courseName] = [];
    }
    acc[student.courseName].push(student);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        <h2 className="text-center text-primary mb-4">
          📚 Course-wise Enrollment List
        </h2>
        <div className="accordion" id="enrollmentAccordion">
          {Object.keys(groupedEnrollments).map((courseName, index) => (
            <div className="card mb-3" key={index}>
              <div
                className="card-header bg-primary text-white"
                onClick={() => toggleCourse(courseName)}
                style={{ cursor: "pointer" }}
              >
                <h5 className="m-0">{courseName}</h5>
              </div>
              {expandedCourse === courseName && (
                <div className="card-body bg-white">
                  <table className="table table-hover table-striped">
                    <thead className="table-secondary">
                      <tr>
                        <th>👨‍🎓 Student Name</th>
                        <th>📅 Enrollment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedEnrollments[courseName].map((student, idx) => (
                        <tr key={idx}>
                          <td>{student.studentName}</td>
                          <td>{student.enrollmentDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
