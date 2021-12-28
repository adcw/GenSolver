const SubSup = ({ allel, small }) => {
  return (
    <>
      <span className="text-sm" style={{ marginRight: allel.sup === "" && allel.sub === "" ? '0px' : '10px'}} >{allel.main}</span>
      <span style={{ position: 'absolute', fontSize: "14px"}}>
        <sup style={{ display: 'block', position: 'relative', left: '-10px', top: '5px' }}>{allel.sup}</sup>
        <sub style={{ display: 'block', position: 'relative', left: '-10px', top: '18px' }}>{allel.sub}</sub>
      </span>
    </>
  )
}

SubSup.defaultProps =
{
  allel:
  {
    "sup": "",
    "sub": "",
    "main": ""
  }
}

export default SubSup
