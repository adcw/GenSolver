import { useEffect } from "react";
import "./allelEditor.css";

const AllelEditor = ({ chosenAllel, setChosenAllel }) => {

    useEffect(() => {
        console.log(chosenAllel);
    }, [chosenAllel])

    return (
        <>
            <div className="allelEditor">
            {
                chosenAllel !== undefined && chosenAllel !== null ?
                <>
                    <input className="sup" maxLength="1"></input>
                    <input className="txt" type="text" maxLength="3" 
                        value={ chosenAllel }
                        onChange={ (e) => setChosenAllel(e.target.value) }
                    ></input>
                    <input className="sub" maxLength="1"></input>
                </>
                : <p>Wybierz allel lub stwórz nowy</p>
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
