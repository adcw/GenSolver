import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState, useEffect } from "react";
import SubSup from "../genepalette/SubSup";
import { OverlayTrigger, Popover } from "react-bootstrap";
import EventEmitter, { E } from "../../utils/events/EventEmitter";

export const AllelSelect = ({ set, targetGenotype, onValueChanged}) => {

  const [currentSelectedAllelIndex, setCurrentSelectedAllelIndex] = useState(0);

  const changeSelection = (indx) => {
    setCurrentSelectedAllelIndex(indx);
    onValueChanged(indx);
  };

  useEffect(() => {
    const subscription = EventEmitter.addListener(E.board_onTemplateChanged, () => {
      setCurrentSelectedAllelIndex(0);
    });
    return () => {
      subscription.remove();
    }
  })

  const popover = (
    <Popover id="popover-basic" className="bg-second text-brigth">
      <Popover.Body className="p-1">
        {
          set.map((v, k) => {
            return <div key={k} className={`text-white pointer hoverable-2 py-2 px-2 ${k === currentSelectedAllelIndex && "selected-1"}`}
              onClick={() => changeSelection(k)}
            >
              <SubSup allel={v}></SubSup>
            </div>
          })
        }
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <OverlayTrigger trigger="click" placement="bottom" overlay={ popover } rootClose>
        <div className="bg-first mx-1 px-2 pointer text-center pt-2" style={{ minWidth: "40px", minHeight: "40px" }}>
          <SubSup allel={set[currentSelectedAllelIndex]}></SubSup>
        </div>
      </OverlayTrigger>

    </div>
  )
}