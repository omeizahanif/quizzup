

export default function Answer(props) {
    const style = {
        backgroundColor: props.isSelected ? "#D6DBF5" : "white"
    }
    return <span className="answer"
            style={style}
            onClick={props.setColor}>
            {props.ans}
            </span>
}