import './genSymbol.css';

const GenSymbol = ({ content }) => {
    return (
        <div className="genSymbol">
            <p>{ content }</p>
        </div>
    )
}

GenSymbol.defaultProps = {
    content: 'A'
}

export default GenSymbol