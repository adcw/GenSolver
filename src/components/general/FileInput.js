import React, { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { CloseButton, Collapse, Form } from "react-bootstrap";
import * as yup from "yup";
import { AppModal } from "./Modal";

export const FileInput = ({ children, onSubmit }) => {
  const openRef = useRef(null);
  const [error, setError] = useState(null);

  const schema = yup
    .object()
    .shape({
      project_name: yup.string().required(),
      default_genes: yup.array().of(
        yup
          .object()
          .shape({
            id: yup.number().required(),
            name: yup.string().required(),
            isActive: yup.boolean().required(),
            allels: yup.array().of(
              yup.object().shape({
                sup: yup.string(),
                main: yup.string().required(),
                sub: yup.string(),
                desc: yup.string().required(),
                prior: yup.number().required(),
              })
            ),
          })
          .required()
      ),
      templates: yup
        .array()
        .of(
          yup.object().shape({
            id: yup.number().required(),
            name: yup.string().required(),
            gene_ids: yup.array().of(yup.number()).required(),
          })
        )
        .required(),
      cross_data: yup
        .object()
        .shape({
          template_id: yup.number().required(),
          genotypes: yup.object().shape({
            A: yup.array().of(yup.array().of(yup.number())),
            B: yup.array().of(yup.array().of(yup.number())),
          }),
          square: yup
            .array()
            .nullable()
            .of(yup.array().of(yup.array().of(yup.array().of(yup.number())))),
          count_list: yup.object(),
        })

        .required(),
    })
    .nullable();

  const handleHide = useCallback(() => {
    setError(undefined);
    openRef.current.value = null;
  }, []);

  useEffect(() => {
    console.log(`error: ${error}`);
  }, [error]);

  const handleChange = useCallback((file) => {
    if (!file) return;
    const fr = new FileReader();

    fr.onload = () => {
      let result;
      try {
        const raw = fr.result;
        const parsed = JSON.parse(raw);
        result = schema.validateSync(parsed);
      } catch (e) {
        setError(` ${e.message}`);
        return undefined;
      }
      console.log(`result: ${JSON.stringify(result, null, 4)}`);
      onSubmit(result);
      openRef.current.value = "";
    };

    fr.readAsText(file);
  }, []);

  const handleFormChange = useCallback((e) => {
    console.log("Foirm change");
    handleChange(e.target.files[0]);
  }, []);

  return (
    <>
      <div
        className="hstack gap-3 pointer hover mb-3"
        onClick={() => openRef.current.click()}
      >
        <Form style={{ display: "none" }}>
          <Form.Control
            ref={openRef}
            onChange={handleFormChange}
            type="file"
            accept="application/JSON"
          />
        </Form>
        {children}
      </div>
      {error && <ErrorWindow error={error} handleHide={handleHide} />}
    </>
  );
};

const ErrorWindow = ({ error, handleHide }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <AppModal
      title={"Błąd"}
      isOpen={error}
      onHide={handleHide}
      className="text-light"
      closeButton
    >
      <p>Nie udało się zaimportować projektu.</p>
      <small className="pointer hoverable text-warning" onClick={handleOpen}>
        <u>Wiadomość systemowa</u>
      </small>
      <Collapse in={open}>
        <div>{error}</div>
      </Collapse>
    </AppModal>
  );
};
