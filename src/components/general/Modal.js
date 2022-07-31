import React, { useState } from "react";
import { Modal } from "react-bootstrap";

export const AppModal = ({
  title,
  footer,
  children,
  isOpen,
  closeButton,
  onHide,
}) => {
  return (
    <>
      <Modal show={isOpen} backdrop="static" keyboard={false} onHide={onHide}>
        <Modal.Header
          className="bg-second border-none"
          closeButton={closeButton}
        >
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
