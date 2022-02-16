export default function Answer(props) {
    
    return <span className="answer"
            
            onClick={props.setColor}>
            {props.ans}
            </span>
}