import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import * as yup from "yup";

export const FileInput = ({ children, onSubmit }) => {
  const openRef = useRef(null);

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
            triggerEdit: yup.boolean(),
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
          square: yup.array().of(yup.array().of(yup.array().of(yup.number()))),
          count_list: yup.object(),
        })

        .required(),
    })
    .nullable();

  const handleChange = (file) => {
    if (!file) return;
    const fr = new FileReader();

    fr.onload = () => {
      // onSubmit(fr.result);
      let result;
      try {
        const raw = fr.result;
        console.log(raw);
        result = schema.validateSync(JSON.parse(raw));
      } catch (error) {
        console.log(error);
        console.log("INVALID");
        return undefined;
      }
      onSubmit(result);
      openRef.current.value = "";
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
          accept="application/JSON"
        />
      </Form>
      {children}
    </div>
  );
};
