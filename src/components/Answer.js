export default function Answer(props) {

    return <span 
            className={`answer ${props.className}`}
            onClick={props.setColor}>
            {props.ans}
            </span>
}