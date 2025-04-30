import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const ApproveModal = ({
  show,
  onClose,
  student,
  refreshPendingStudents,
  refreshAllStudents,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken"); // Get the token from Cookies

  const handleApprove = async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${api}/student-profile/status/${student._id}`,
        { status: 1 }, // Approving the student by setting status to 1
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token here
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode === 200) {
        setLoading(false);
        onClose(); // Close the modal after approval
        refreshPendingStudents(); // Refresh the pending students list
        refreshAllStudents(); // Refresh the all students list to include the newly approved student
        alert(response.data.message); // Show success message
      } else {
        throw new Error(response.data.message || "Failed to approve student.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message); // Handle error
      console.error("Error approving student:", err);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Approve Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {student && (
          <>
            <Form.Group controlId="formStudentName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={student.name} disabled />
            </Form.Group>
            <Form.Group controlId="formStudentContact">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" value={student.contact} disabled />
            </Form.Group>
            <Form.Group controlId="formStudentEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={student.email} disabled />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleApprove} disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Approve Student"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApproveModal;
