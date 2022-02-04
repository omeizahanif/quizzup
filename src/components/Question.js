import {useState, useEffect} from  "react"

export default function Question(props) {
    
    return (
        <div>
            <p>{props.ques}</p>
            <div>{props.answerList}</div>
        </div>
    )
}