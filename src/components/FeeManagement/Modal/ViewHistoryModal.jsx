// src/pages/Admin/FeeEntry/ViewHistoryModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";

const ViewHistoryModal = ({ show, onHide, paymentHistory = [] }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Payment History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {paymentHistory.length > 0 ? (
          <ul>
            {paymentHistory.map((pmt) => (
              <li key={pmt._id}>
                <strong>
                  {pmt.month} {pmt.year}
                </strong>{" "}
                - ₹{pmt.feeAmount} via {pmt.paymentMethod} on{" "}
                {moment(pmt.paymentDate).format("DD-MM-YYYY")}
              </li>
            ))}
          </ul>
        ) : (
          <p>No payment history available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewHistoryModal;
