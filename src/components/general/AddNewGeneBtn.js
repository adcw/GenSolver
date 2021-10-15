import { Button } from "react-bootstrap"
import { ACTION } from "../../App"

const AddNewGeneBtn = ({targetGeneList, dispatch}) => {

    const addGene = () => dispatch({ type: ACTION.ADD_DEFAULT_GENE, payload: { targetGeneList: targetGeneList }});

    return (
        <Button className="my-btn-dark w-100 btn-sm" onClick={ addGene }>Dodaj nowy gen</Button>
    )
}

export default AddNewGeneBtn
