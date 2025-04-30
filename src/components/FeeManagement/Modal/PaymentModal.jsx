import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { api } from "../../../api";
import Cookies from "js-cookie";

const PaymentModal = ({ show, handleClose, feeId, refreshData }) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("SuperAdminToken");

    try {
      const res = await axios.post(
        `${api}/student/fee/pay/${feeId}`,
        {
          paymentDate,
          amountPaid: parseFloat(amountPaid),
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === 1) {
        alert("Payment successful!");
        refreshData();
        handleClose();
      } else {
        alert(res.data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePaymentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount Paid</Form.Label>
            <Form.Control
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              required
              min={1}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Date</Form.Label>
            <Form.Control
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
