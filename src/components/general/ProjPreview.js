import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { Accordion, Stack } from "react-bootstrap";
import "./ProjPreview.css";
import { AppContext } from "../../AppContextProvider";

export const ProjPreview = ({ project, error, onChange }) => {
  const { initialState, state, dispatch } = useContext(AppContext);
  // const [editedVersion, setEditedVersion] = useState(project);

  const projectNames = useMemo(
    () => state.projects && state.projects.map((p) => p.project_name),
    [state]
  );

  // const validate = useCallback(() => {
  //   console.log(editedVersion);
  //   if (editedVersion && projectNames.includes(editedVersion.project_name)) {
  //     setError(`Projekt o nazwie ${editedVersion.project_name} już istnieje!`);
  //     return;
  //   }
  //   setError(null);
  // }, [editedVersion, projectNames]);

  // useEffect(() => validate(), [validate]);

  if (!project) return null;

  return (
    <Stack direction="vertical">
      <p style={{ marginBottom: "2px" }}>Nazwa:</p>
      <input
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        type="text"
        defaultValue={project.project_name}
      />
      <p className="text-danger">{error}</p>
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
                <p>Allele:</p>
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
