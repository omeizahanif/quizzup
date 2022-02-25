export default function Question(props) {

    return (
        <div className="question-block">
            <p>{props.ques}</p>
            <div className='answer-list'>{props.answerElements}</div>
            <p className="correctAnswer">{props.correctAnswer}</p>
        </div>
    )
}