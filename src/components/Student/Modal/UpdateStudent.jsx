import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const UpdateStudent = ({ show, handleClose, student, updateStudentState }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  // **Fill form when a student is selected**
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        contact: student.contact || "",
      });
    }
  }, [student]);

  // **Handle input changes**
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // **Handle update request**
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${api}/students/update/${student?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // Debugging

      if (response.data?.status === 1) {
        alert("Student updated successfully!");

        // ✅ **Update UI instantly without refreshing**
        if (typeof updateStudentState === "function") {
          updateStudentState(student._id, {
            name: formData.name,
            email: formData.email,
            contact: formData.contact,
          });
        } else {
          console.warn("updateStudentState is not defined or not a function");
        }

        // **Close modal & reset form**
        handleClose();
      } else {
        throw new Error(response.data?.message || "Failed to update student.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Update"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStudent;
