import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ButtonDelete = (props) => {
  return (
    <button className="btn btn-xs btn-delete" {...props}>
      <FontAwesomeIcon icon="times"></FontAwesomeIcon>
    </button>
  )
}
