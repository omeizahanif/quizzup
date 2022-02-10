import { useState } from 'react';
import Answer from './Answer';



export default function Question(props) {
    const [answers, setAnswers] = useState(props.answerList);

    const answerEls = answers.map(eachAnswer => {
                            return <Answer ans={eachAnswer.value} 
                            key={eachAnswer.id}
                            isSelected={eachAnswer.isSelected}
                            setColor={() => setColor(eachAnswer.id)}/>
                        })
    
    function setColor(id) {
        /*setQuestions(prevQues => {
            return prevQues.map(eachQuestion => {
                const updatedAnswers = changeSelection(eachQuestion.answers, id);
                return { ...eachQuestion, answers: updatedAnswers}
               --> <div className="answer-list">{props.answerElements}</div>
            })
        })*/
        setAnswers(prevAnswers => {
            return prevAnswers.map(item => {
                if (item.id === id) {
                   return { ...item, isSelected: true}
                }
                return {...item, isSelected: false}
            })
        })

    }



    return (
        <div className="question-block">
            <p>{props.ques}</p>
            {answerEls}
            <span className="correctAnswer">{props.correctAnswer}</span>
        </div>
    )
}