import {useState, useEffect} from  "react"

export default function Question(props) {
    
    return (
        <div className="question-block">
            <p>{props.ques}</p>
            <div>{props.answerList}</div>
            <span className="correctAnswer">{props.correctAnswer}</span>
        </div>
    )
}