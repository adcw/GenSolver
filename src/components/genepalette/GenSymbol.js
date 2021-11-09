import './genSymbol.css';
import SubSup from './SubSup';

const GenSymbol = ({ content, isAddButton, onClick }) => {
  return (
    <div className={`genSymbol ${isAddButton ? 'addBtn' : ''}`} onClick={onClick}>
      <p>{isAddButton ? "+" :
        <SubSup allel={content} />
      }</p>
    </div>
  )
}

GenSymbol.defaultProps = {
  content: 'A'
}

export default GenSymbol