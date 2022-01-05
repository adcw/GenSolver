const SubSup2 = ({ allel, small, ...props }) => {
  return (
    <>
      <span style={{ marginRight: allel.sup === "" && allel.sub === "" ? '0px' : '10px', fontSize: "30px"}} >{allel.main}</span>
      <span style={{ position: 'absolute', fontSize: "25px"}}>
        <sup style={{ display: 'block', position: 'relative', left: '-10px', top: '8px' }}>{allel.sup}</sup>
        <sub style={{ display: 'block', position: 'relative', left: '-10px', top: '35px' }}>{allel.sub}</sub>
      </span>
    </>
  )
}

SubSup2.defaultProps =
{
  allel:
  {
    "sup": "",
    "sub": "",
    "main": ""
  }
}

export default SubSup2
