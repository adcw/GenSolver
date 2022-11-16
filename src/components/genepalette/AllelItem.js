import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import AllelEditor from "./AllelEditor";
import SubSup from "./SubSup";

export const AllelItem = ({
  allel,
  onClick,
  setChosenAllelIndex,
  k,
  tempGeneContent,
  editDesc,
  editPriority,
  deleteAllel,
  chosenAllelIndex,
  D_removeAllel,
  keyId,
  saveModifiedAllel,
}) => {
  const [shown, setShown] = useState(false);

  const popover = (
    <Popover id="popover-basic" className="shadowed genItem-popover bg-first">
      <Popover.Header as="h6" className="bg-second">
        <p className="mb-0 text-sm d-inline">Edytuj allel</p>
        <FontAwesomeIcon
          icon="times"
          className="f-right dismiss-btn mt-1 text-sm"
          onClick={() => document.body.click()}
        ></FontAwesomeIcon>
      </Popover.Header>

      <Popover.Body className="bg-first txt-bright popover-body">
        <AllelEditor
          chosenAllel={tempGeneContent.allels[chosenAllelIndex]}
          chosenAllelIndex={chosenAllelIndex}
          removeAllel={D_removeAllel}
          geneId={keyId}
          saveModifiedAllel={saveModifiedAllel}
          onClose={() => setShown(false)}
        />

        {/* </Form> */}
      </Popover.Body>
    </Popover>
  );

  return (
    <span className="tmp-gene-list-item d-flex">
      <OverlayTrigger
        show={shown}
        onToggle={(shown) => setShown(shown)}
        rootClose
        trigger="click"
        placement="right"
        overlay={popover}
      >
        <div
          className="genSymbol"
          onClick={() => {
            setChosenAllelIndex(k);
            // setEditorShown(true);
          }}
        >
          <p>
            <SubSup allel={allel} small={true} />
          </p>
        </div>
      </OverlayTrigger>

      <input
        className="btn-xs w-100"
        value={tempGeneContent.allels[k].desc}
        onChange={(e) => editDesc(k, e.target.value)}
      ></input>

      <p className="text-sm m-0 pl-3 pr-2">Priorytet:</p>

      <input
        className="priority-input"
        type="number"
        min="0"
        max="7"
        value={tempGeneContent.allels[k].prior}
        onChange={(e) => {
          let val = e.target.value ?? 0;
          val = val === "" ? 0 : val;
          console.log(val);
          val = val < 0 ? 0 : val;
          val = val > 7 ? 7 : val;
          editPriority(k, val);
        }}
      ></input>

      <FontAwesomeIcon
        icon="times"
        className="f-right dismiss-btn mt-2 text-sm mx-2 pointer"
        onClick={() => deleteAllel(k)}
      ></FontAwesomeIcon>
    </span>
  );
};
