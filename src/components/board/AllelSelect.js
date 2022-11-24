import React, { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import EventEmitter, { E } from "../../utils/events/EventEmitter";
import SubSup from "../genepalette/SubSup";

export const AllelSelect = ({
  geneName,
  set,
  onValueChanged,
  defaultSelIndex,
}) => {
  const [currentSelectedAllelIndex, setCurrentSelectedAllelIndex] =
    useState(defaultSelIndex);

  const changeSelection = (indx) => {
    setCurrentSelectedAllelIndex(indx);
    onValueChanged(indx);
    document.body.click();
  };

  useEffect(() => {
    setCurrentSelectedAllelIndex(defaultSelIndex);
    const sub_tch = EventEmitter.addListener(E.board_onTemplateChanged, () => {
      setCurrentSelectedAllelIndex(defaultSelIndex);
    });

    const sub_def = EventEmitter.addListener(E.onRestoreDefault, () => {
      setCurrentSelectedAllelIndex(defaultSelIndex);
    });
    return () => {
      sub_tch.remove();
      sub_def.remove();
    };
  }, [defaultSelIndex]);

  const popover = (
    <Popover id="popover-basic" className="bg-second text-brigth">
      <Popover.Body className="p-1">
        {set.map((v, k) => {
          return (
            <div
              key={k}
              className={`text-white pointer hoverable-2 py-2 px-2 ${
                k === currentSelectedAllelIndex && "selected-1"
              }`}
              onClick={() => changeSelection(k)}
            >
              {geneName}
              :&nbsp;{v.desc}
            </div>
          );
        })}
      </Popover.Body>
    </Popover>
  );

  return (
    <div>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={popover}
        rootClose
      >
        <div
          className="bg-first mx-1 px-2 pointer text-center pt-2"
          style={{ minWidth: "40px", minHeight: "40px" }}
        >
          <SubSup allel={set[currentSelectedAllelIndex]}></SubSup>
        </div>
      </OverlayTrigger>
    </div>
  );
};

AllelSelect.defaultProps = {
  onValueChanged: () => console.log("val"),
  defaultSelIndex: 0,
};
