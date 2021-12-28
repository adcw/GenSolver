import './genSymbol.css';
import SubSup from './SubSup';

const AllelSymbol = ({ content, isAddButton, onClick }) => {
  return (
    <div className={`genSymbol ${isAddButton ? 'addBtn' : ''}`} onClick={onClick}>
      <p>{isAddButton ? "+" :
        <SubSup allel={content} small={true}/>
      }</p>
    </div>
  )
}

AllelSymbol.defaultProps = {
  content: 'A'
}

export default AllelSymbol