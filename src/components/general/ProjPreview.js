import React from "react";
import { Accordion, Stack } from "react-bootstrap";
import "./ProjPreview.css";

export const ProjPreview = ({ project }) => {
  if (!project) return null;
  return (
    <Stack direction="vertical">
      <p style={{ marginBottom: "2px" }}>Nazwa:</p>
      <h6>{project.project_name}</h6>
      <p className="pt-2">Geny:</p>

      <Accordion className="pr-accordion">
        {project.default_genes.map((gene, key) => {
          return (
            <Accordion.Item
              className="bg-first text-light"
              eventKey={key}
              key={key}
            >
              <Accordion.Header>{gene.name}</Accordion.Header>
              <Accordion.Body>
                <ol>
                  {gene.allels.map((allel, key1) => {
                    return <li key={key1}>{allel.desc}</li>;
                  })}
                </ol>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Stack>
  );
};
