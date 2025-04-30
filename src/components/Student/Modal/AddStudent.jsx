import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const AddStudent = ({ show, handleClose, refreshStudents }) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("SuperAdminToken");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(`${api}/students/create`, formData, {
        headers,
      });

      if (response.data?.status === 1) {
        console.log("Student added successfully!");
        refreshStudents();
        handleClose();
      } else {
        throw new Error(response.data.message || "Failed to create student.");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={3}
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddStudent;
