import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export const AppModal = ({ title, footer, children, isOpen }) => {
  return (
    <>
      <Modal show={isOpen} backdrop="static" keyboard={false}>
        <Modal.Header className="bg-second border-none">
          <Modal.Title size="sm">{title ?? ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-first">{children}</Modal.Body>

        {footer && (
          <Modal.Footer className="bg-second border-none">
            {footer}
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};
