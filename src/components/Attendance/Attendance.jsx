import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Form, Table, Alert, Spinner, Button, Row, Col } from "react-bootstrap";
import MarkModal from "./Modal/MarkModal";
import UpdateModal from "./Modal/UpdateModal";
import { api } from "../../api";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const token = Cookies.get("SuperAdminToken");

  const handleOpenUpdate = (record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleCloseUpdate = () => {
    setShowUpdateModal(false);
    setSelectedRecord(null);
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${api}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const fetchAttendance = async (studentId) => {
    setLoading(true);
    setError("");
    setAttendance([]);
    try {
      const res = await axios.get(`${api}/attendance/student`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { studentId },
      });
      if (res.data.status === 1 && res.data.data.length > 0) {
        setAttendance(res.data.data);
      } else {
        setError("No attendance records found.");
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="container py-4">
      <h3 className="text-primary fw-bold mb-4 border-bottom pb-2">
        📚 Student Attendance
      </h3>

      <Form className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Form.Group controlId="studentSelect">
              <Form.Label className="fw-semibold">Select Student</Form.Label>
              <Form.Select
                value={selectedStudent}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedStudent(id);
                  if (id) fetchAttendance(id);
                }}
                className="shadow-sm border-primary"
              >
                <option value="">-- Choose a Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <Alert variant="warning" className="text-center fw-semibold">
          {error}
        </Alert>
      )}

      {attendance.length > 0 && (
        <Table
          striped
          bordered
          hover
          responsive
          className="align-middle shadow-sm"
        >
          <thead className="table-primary">
            <tr>
              <th>Course</th>
              <th>Date</th>
              <th>Status</th>
              <th>Week</th>
              <th>Day</th>
              <th>Schedule</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att) => (
              <tr key={att._id}>
                <td>{att.courseId?.name || "N/A"}</td>
                <td>{new Date(att.date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      att.status === "Present"
                        ? "bg-success"
                        : att.status === "Absent"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {att.status}
                  </span>
                </td>
                <td>{att.weekNumber}</td>
                <td>{att.classDay}</td>
                <td>{att.schedule?.join(", ")}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    {/* <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        const student = students.find(
                          (s) => s._id === selectedStudent
                        );
                        setModalStudent(student);
                        setShowModal(true);
                      }}
                    >
                      Mark
                    </Button> */}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        setModalStudent({
                          _id: selectedStudent,
                          name:
                            students.find((s) => s._id === selectedStudent)
                              ?.name || "N/A",
                        });
                        setShowModal(true);
                      }}
                    >
                      Mark
                    </Button>

                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => handleOpenUpdate(att)}
                    >
                      Update
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {modalStudent && (
        <MarkModal
          show={showModal}
          onHide={() => setShowModal(false)}
          student={modalStudent}
          onSuccess={() => fetchAttendance(modalStudent._id)}
        />
      )}

      <UpdateModal
        show={showUpdateModal}
        onHide={handleCloseUpdate}
        record={selectedRecord}
        onSuccess={() => fetchAttendance(selectedStudent)}
      />
    </div>
  );
};

export default Attendance;
