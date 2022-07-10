import React from "react";
import { useRef } from "react";
import { Form } from "react-bootstrap";

export const FileInput = ({ children, onSubmit }) => {
  const openRef = useRef(null);

  const handleChange = (file) => {
    const fr = new FileReader();

    fr.onload = () => {
      onSubmit(fr.result);
    };

    fr.readAsText(file);
  };

  return (
    <div
      className="hstack gap-3 pointer hover mb-3"
      onClick={() => openRef.current.click()}
    >
      <Form style={{ display: "none" }}>
        <Form.Control
          ref={openRef}
          onChange={(e) => handleChange(e.target.files[0])}
          type="file"
        />
      </Form>
      {children}
    </div>
  );
};
