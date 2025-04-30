import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { api } from "../../../api";
import Cookies from "js-cookie";

const CreateEntry = ({ show, onHide, onSuccess }) => {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Unpaid");

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const token = Cookies.get("SuperAdminToken");
      const res = await axios.get(`${api}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching students", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = Cookies.get("SuperAdminToken");
      const res = await axios.get(`${api}/courses/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchStudents();
      fetchCourses();
      setStudentId("");
      setCourseId("");
      setFeeAmount("");
      setDueDate("");
      setStatus("Unpaid");

      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // yyyy-mm-dd
      setDueDate(formattedDate);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("SuperAdminToken");

    try {
      const res = await axios.post(
        `${api}/entry/create`,
        {
          studentId,
          courseId,
          feeAmount: parseFloat(feeAmount),
          dueDate,
          status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 1) {
        alert("Entry created successfully!");
        onSuccess();
        onHide();
      } else {
        alert(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error creating entry", err);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Fee Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Student</Form.Label>
            <Form.Select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fee Amount</Form.Label>
            <Form.Control
              type="number"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </Form.Group>

          {/* Optionally keep this if needed later
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Due">Due</option>
            </Form.Select>
          </Form.Group> */}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create Entry"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEntry;
