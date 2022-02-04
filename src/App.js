import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';
import Answer from './components/Answer';

function App() {
    const [overlay, showOverlay] = useState(true)
    const arr = ["Adios", "Hola", "Au Revoir", "Salir"]
    const answerList = arr.map(value => <Answer ans={value}/>)
    
    
    function startQuiz() {
        showOverlay(prevOverlay => !prevOverlay);
    }

    return (
        <main>
            {overlay && <Intro startQuiz={startQuiz}/>}
            <Question 
                ques={"How would one say goodbye in Spanish?"}
                answerList={answerList}
            /> 
        </main>
               
    )
}

export default App;
