import './genSymbol.css';

const GenSymbol = ({ content, isAddButton, onClick }) => {
    return (
        <div className={`genSymbol ${isAddButton ? 'addBtn' : ''}`} onClick={ onClick }>
            <p>{ isAddButton ? "+" : content }</p>
        </div>
    )
}

GenSymbol.defaultProps = {
    content: 'A'
}

export default GenSymbol