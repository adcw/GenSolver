export const GTContent = (props) => {
  return (
    <span className="d-flex mt-2" props={ props }>
      <h6 className="mr-2 text-sm text-center" style={{ minWidth: "50px" }}>{ props.title }</h6>
        {props.children}
      {/* <input type="text" className="btn-xs" defaultValue={template.name}></input> */}
    </span>
  )
}
