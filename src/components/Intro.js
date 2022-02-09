import {useState, useEffect} from "react";

export default function Intro(props) {
    
    return (
        <div className="intro-container">
            <h1>Quizzical</h1>
            <p>Some description if needed</p>
            <button onClick={props.startQuiz}>Start quiz</button>
        </div>
    )
}