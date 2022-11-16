import { useEffect, useRef, useState } from "react";
import "./allelEditor.css";

const AllelEditor = ({
  chosenAllel,
  saveModifiedAllel,
  removeAllel,
  chosenAllelIndex,
  geneId,
  onClose,
}) => {
  const subInput = useRef(null);
  const supInput = useRef(null);
  const mainInput = useRef(null);

  const [modifiedAllel, setModifiedAllel] = useState(chosenAllel);

  useEffect(() => {
    // console.log("Chosen allel is " + JSON.stringify(chosenAllel) + " chosenAllelIndex: " + chosenAllelIndex
    //  + " geneId: " + geneId);
    setModifiedAllel(chosenAllel);
  }, [chosenAllel]);

  useEffect(() => {
    // console.log("Modified allel is " + JSON.stringify(modifiedAllel));
  }, [modifiedAllel]);

  const modifiyAllel = () => {
    setModifiedAllel({
      sup: supInput.current.value,
      main: mainInput.current.value,
      sub: subInput.current.value,
      desc: chosenAllel.desc,
      prior: chosenAllel.prior,
    });
  };

  const saveAllel = () => {
    saveModifiedAllel(chosenAllelIndex, modifiedAllel);
  };

  return (
    <>
      <div className="allelEditor">
        {modifiedAllel !== undefined && modifiedAllel !== null ? (
          <div className="ae-panel">
            <input
              ref={supInput}
              type="text"
              className="sup"
              maxLength="1"
              value={modifiedAllel.sup}
              onChange={modifiyAllel}
            ></input>

            <input
              ref={mainInput}
              className="txt"
              type="text"
              maxLength="3"
              value={modifiedAllel.main}
              onChange={modifiyAllel}
            ></input>

            <input
              ref={subInput}
              type="text"
              className="sub"
              maxLength="1"
              value={modifiedAllel.sub}
              onChange={modifiyAllel}
            ></input>
          </div>
        ) : (
          <p>Wybierz allel lub stwórz nowy</p>
        )}
      </div>

      <div className="ae-buttons">
        {modifiedAllel !== undefined && modifiedAllel !== null && (
          <>
            <button
              type="button"
              className="btn bg-second btn-xs txt-bright"
              onClick={(e) => {
                saveAllel();
                onClose && onClose();
              }}
            >
              OK
            </button>
          </>
        )}
      </div>
    </>
  );
};

AllelEditor.defaultProps = {
  setChosenAllel: (val) => console.log(`changed to ${val}`),
};

export default AllelEditor;
