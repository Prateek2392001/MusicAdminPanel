import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const CreatePayment = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    studentID: "",
    courseID: "",
    totalFee: "",
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (show) {
      fetchStudents();
      fetchCourses();
    }
  }, [show]);

  const fetchStudents = async () => {
    try {
      const token = Cookies.get("SuperAdminToken");
      const res = await axios.get(`${api}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch students");
    }
  };

  const fetchCourses = async () => {
    try {
      const token = Cookies.get("SuperAdminToken");
      const res = await axios.get(`${api}/courses/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch courses");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const token = Cookies.get("SuperAdminToken");
      const res = await axios.post(
        `${api}/student/fee/create`,
        {
          studentID: formData.studentID,
          courseID: formData.courseID,
          totalFee: Number(formData.totalFee),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === 1) {
        onSuccess(res.data.data);
        onHide();
        setFormData({ studentID: "", courseID: "", totalFee: "" });
      } else {
        setErrorMsg(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Student Fee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Student</Form.Label>
            <Form.Select
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
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
              name="courseID"
              value={formData.courseID}
              onChange={handleChange}
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
            <Form.Label>Total Fee</Form.Label>
            <Form.Control
              type="number"
              name="totalFee"
              value={formData.totalFee}
              onChange={handleChange}
              placeholder="Enter Total Fee"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreatePayment;
