import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { api } from "../../../api";

const DeleteBanner = ({ show, handleClose, bannerId, fetchBanners }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = Cookies.get("SuperAdminToken");

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete(`${api}/banners/delete/${bannerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 1) {
        fetchBanners();
        handleClose();
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to delete this banner?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteBanner;
