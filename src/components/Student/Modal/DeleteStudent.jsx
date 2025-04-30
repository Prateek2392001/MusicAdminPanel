import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteStudent = ({ show, handleClose, student, refreshStudents }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const token = Cookies.get("SuperAdminToken");
      await axios.delete(`${api}/students/delete/${student._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshStudents();
      handleClose();
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Student</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to delete this student?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteStudent;
