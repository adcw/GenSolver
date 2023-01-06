import React, { useState } from "react";
import { useCallback } from "react";
import { CloseButton, Modal } from "react-bootstrap";

export const AppModal = ({
  title,
  footer,
  children,
  isOpen,
  closeButton,
  onHide,
  header,
}) => {
  const handleHide = useCallback(() => {
    onHide && onHide();
  }, [onHide]);

  return (
    <>
      <Modal show={isOpen} backdrop="static" keyboard={false} onHide={onHide}>
        <Modal.Header className="bg-second border-none">
          <Modal.Title size="sm">{title ?? ""}</Modal.Title>
          {closeButton ? (
            <CloseButton variant="white" onClick={handleHide} />
          ) : (
            <></>
          )}
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
