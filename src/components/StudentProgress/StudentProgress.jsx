import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentProgress = () => {
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    axios
      .get("https://freetestapi.com/api/v1/student-progress")
      .then((response) => setProgressData(response.data.data))
      .catch((error) => console.error("Error fetching progress data:", error));
  }, []);

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg border-0 rounded-3 bg-light">
        <h2 className="text-center text-primary mb-4">
          📊 Student Progress Tracking
        </h2>
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="p-3 bg-white shadow-sm rounded">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={progressData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="studentName" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "5px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#007bff"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-md-4">
            <div className="table-responsive">
              <table className="table table-hover table-striped shadow-sm rounded">
                <thead className="table-primary text-white">
                  <tr>
                    <th>👩‍🎓 Student Name</th>
                    <th>📈 Progress (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {progressData.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center text-muted py-3">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    progressData.map((student) => (
                      <tr key={student.id} className="align-middle">
                        <td className="fw-bold">{student.studentName}</td>
                        <td>
                          <span className="badge bg-success p-2">
                            {student.progress}%
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
