const SubSup = ({ allel }) => {
  return (
    <>
      <span style={{ marginRight: allel.sup === "" && allel.sub === "" ? '0px' : '12px' }} >{allel.main}</span>
      <span style={{ position: 'absolute', fontSize: "12px"}}>
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
