

export default function Intro(props) {
    
    return (
        <div className="intro-container">
            <h1 className="gameTitle">Quizzical</h1>
            <p>5 questions to test your general knowledge</p>
            <button onClick={props.startQuiz} className="startBtn">Start quiz</button>
        </div>
    )
}