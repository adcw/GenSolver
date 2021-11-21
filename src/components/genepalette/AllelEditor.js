import { useEffect, useRef, useState } from "react";
import "./allelEditor.css";

const AllelEditor = ({ chosenAllel, saveModifiedAllel, 
  removeAllel, chosenAllelIndex, geneId }) => {

  const subInput = useRef(null);
  const supInput = useRef(null);
  const mainInput = useRef(null);

  const [modifiedAllel, setModifiedAllel] = useState();

  useEffect(() => {
    console.log("Chosen allel is " + JSON.stringify(chosenAllel) + " chosenAllelIndex: " + chosenAllelIndex
       + " geneId: " + geneId);
    setModifiedAllel(chosenAllel);
  }, [chosenAllel]);

  useEffect(() => {
    console.log("Modified allel is " + JSON.stringify(modifiedAllel));
  }, [modifiedAllel])

  const modifiyAllel = () => {
    setModifiedAllel(
      {
        "sup": supInput.current.value,
        "main": mainInput.current.value,
        "sub": subInput.current.value
      }
    );
  }

  const saveAllel = () => {
    console.log("save");
    console.log(JSON.stringify(modifiedAllel) === JSON.stringify(chosenAllel));
    saveModifiedAllel(chosenAllelIndex, modifiedAllel);
  }

  return (
    <>
      <div className="allelEditor">
        {
          modifiedAllel !== undefined && modifiedAllel !== null ?
          <div className="ae-panel">
            <input ref={supInput} className="sup" maxLength="1"
              value={ modifiedAllel.sup }
              onChange={ modifiyAllel }
            ></input>

            <input ref={mainInput} className="txt" type="text" maxLength="3"
              value={ modifiedAllel.main }
              onChange={ modifiyAllel }
            ></input>

            <input ref={subInput} className="sub" maxLength="1"
              value={ modifiedAllel.sub }
              onChange={ modifiyAllel }
            ></input>
          </div>
          : <p>Wybierz allel lub stwórz nowy</p>
        }
      </div>

      <div className="ae-buttons">
      {
        (modifiedAllel !== undefined && modifiedAllel !== null) &&
        <>
          <button 
            className="btn bg-second btn-xs txt-bright"
            onClick={ (e) => e.preventDefault() || saveAllel() }
            >
            OK
          </button>

          <button 
            className="btn btn-danger btn-xs"
            onClick={ (e) => removeAllel(chosenAllelIndex) }
          >
            Usuń
          </button>
        </>
      }
      
      </div>
      
    </>
  )
}

AllelEditor.defaultProps =
{
  setChosenAllel: (val) => console.log(`changed to ${val}`)
}

export default AllelEditor
