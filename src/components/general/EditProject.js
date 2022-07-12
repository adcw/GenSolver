import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext } from "react";
import { Popover, Button } from "react-bootstrap";
import "../../App.css";
import "../genepalette/GenItem.css";
import { AppModal } from "./Modal";

import { AppContext } from "../../AppContextProvider";

const EditProject = () => {
  const { initialState, state, dispatch } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleHide = () => {
    setIsOpen(false);
    setIsEditing(false);
  };

  const startEdit = () => {
    setIsOpen(true);
    setIsEditing(true);
  };

  return (
    <>
      <FontAwesomeIcon
        size="1x"
        icon="pencil-alt"
        className="text-light pointer"
        onClick={startEdit}
      ></FontAwesomeIcon>
      <AppModal title="Edycja projektu" isOpen={isOpen}>
        <div className="vstack">
          <p className="mb-1 text-sm">Zmiana nazwy projektu:</p>
          <input
            defaultValue={
              isEditing ? state.projects[state.curr].project_name : ""
            }
          />

          <hr className="text-light" />
          <p className="text-sm p-0 m-0 hover pointer text-danger">
            Usuń projekt
          </p>
          <p className="text-sm p-0 m-0 hover pointer text-warning">
            Wyczyść projekt
          </p>
          <hr className="text-light" />

          <div className="hstack gap-2">
            <Button className="btn-xs btn-light ms-auto" onClick={handleHide}>
              Anuluj
            </Button>
            <Button className="btn-xs btn-info">Zapisz</Button>
          </div>
        </div>
      </AppModal>
    </>

    // <>
    //   <FontAwesomeIcon
    //     size="1x"
    //     icon="pencil-alt"
    //     className="text-light pointer"
    //     onClick={startEdit}
    //   ></FontAwesomeIcon>
    //   <Modal
    //     show={isOpen}
    //     onHide={handleHide}
    //     backdrop="static"
    //     keyboard={false}
    //   >
    //     <Modal.Header className="bg-first border-none">
    //       <Modal.Title size="sm">Edycja projektu</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body className="bg-second">
    //       <div className="vstack">
    //         <p className="mb-1 text-sm">Zmiana nazwy projektu:</p>
    //         <input
    //           defaultValue={
    //             isEditing ? state.projects[state.curr].project_name : ""
    //           }
    //         />

    //         <hr className="text-light" />
    //         <p className="text-sm p-0 m-0 hover pointer text-danger">
    //           Usuń projekt
    //         </p>
    //         <p className="text-sm p-0 m-0 hover pointer text-warning">
    //           Wyczyść projekt
    //         </p>
    //         <hr className="text-light" />

    //         <div className="hstack gap-2">
    //           <Button className="btn-xs btn-light ms-auto" onClick={handleHide}>
    //             Anuluj
    //           </Button>
    //           <Button className="btn-xs btn-info">Zapisz</Button>
    //         </div>
    //       </div>
    //     </Modal.Body>
    //     {/*}
    //   <Modal.Footer>
    //     <Button variant="secondary" onClick={handleClose}>
    //       Close
    //     </Button>
    //     <Button variant="primary">Understood</Button>
    //   </Modal.Footer> */}
    //   </Modal>
    // </>
  );
};

export default EditProject;
