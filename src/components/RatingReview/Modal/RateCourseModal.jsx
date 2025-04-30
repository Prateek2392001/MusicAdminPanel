import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";
import { FaStar } from "react-icons/fa";

const RateCourseModal = ({ show, handleClose, fetchRatings }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  useEffect(() => {
    if (show) {
      fetchCourses();
      resetForm(); // Reset when modal opens
    }
  }, [show]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${api}/courses/get`);
      if (res.data.status === 1) {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || rating < 1 || rating > 5) {
      setMessage({
        type: "danger",
        text: "Please select a course and give a rating between 1 and 5.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${api}/rating`,
        {
          courseID: selectedCourse,
          rating: parseFloat(rating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message === "Admin rating added successfully.") {
        setMessage({
          type: "success",
          text: "Rating submitted successfully!",
        });

        fetchRatings();
        setTimeout(() => {
          resetForm();
          handleClose();
        }, 1000);
      } else {
        setMessage({
          type: "danger",
          text: response.data.message || "Failed to submit rating.",
        });
      }
    } catch (err) {
      console.error("Error submitting rating", err);
      setMessage({ type: "danger", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCourse("");
    setRating(0);
    setMessage(null);
  };

  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rate a Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Select Course</Form.Label>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  color={star <= rating ? "gold" : "gray"}
                  onClick={() => handleStarClick(star)}
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    marginRight: "5px",
                  }}
                />
              ))}
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => {
                resetForm();
                handleClose();
              }}
              disabled={loading}
              className="me-2"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Submit Rating"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RateCourseModal;
