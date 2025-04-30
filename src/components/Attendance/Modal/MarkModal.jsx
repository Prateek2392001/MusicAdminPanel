import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MarkModal = ({ show, onHide, student, onSuccess }) => {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentDay, setCurrentDay] = useState("");

  const token = Cookies.get("SuperAdminToken");

  // Fetch student courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${api}/courses/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    if (show) {
      fetchCourses();
      const today = new Date();
      setDate(today.toISOString().slice(0, 10)); // Default to today's date
      setCurrentDay(daysOfWeek[today.getDay()]); // Get the current day of the week
      setCourseId("");
      setStatus("Present");
      setSchedule([]);
      setError("");
    }
  }, [show]);

  const handleScheduleToggle = (day) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    if (!courseId || !date || schedule.length === 0) {
      setError("Please fill all fields and select at least one schedule day.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${api}/attendance/mark`,
        {
          studentId: student._id,
          courseId,
          date,
          status,
          schedule,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === 1) {
        onSuccess();
        onHide();
      } else {
        setError(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mark Attendance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Course</Form.Label>
          <Form.Select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
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
          <Form.Label>Date ({currentDay})</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Schedule (Select at least 1 day)</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <Form.Check
                key={day}
                type="checkbox"
                label={day}
                checked={schedule.includes(day)}
                onChange={() => handleScheduleToggle(day)}
              />
            ))}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving..." : "Mark"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MarkModal;
