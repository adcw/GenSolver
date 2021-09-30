const Card = (props) => {
    return (
        <div className="mycard bg-second shadowed">
            {props.children}
        </div>
    )
}

export default Card
