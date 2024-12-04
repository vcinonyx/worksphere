import React from "react";
import { Modal, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AlertModal = ({ onHide, ...props }) => {
  return (
      <Modal
          {...props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This Department has Employees. Transfer Employees to a new Department first.
          <br />
          <Link to="/employee-list">Employee List</Link>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
  );
};

export default AlertModal;
