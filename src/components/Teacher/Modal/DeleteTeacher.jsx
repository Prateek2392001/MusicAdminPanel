import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteTeacher = ({ show, handleClose, instructor, refreshList }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken"); // Retrieve the token

  const handleDelete = async () => {
    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${api}/instructors/delete/${instructor._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data); // Debugging

      if (response.data?.status === 1) {
        alert("Instructor deleted successfully!");
        refreshList(); // Refresh category list
        handleClose();
      } else {
        alert(response.data?.message || "Failed to delete category.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error deleting instructor. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        Are you sure you want to delete <strong>{instructor?.name}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTeacher;
