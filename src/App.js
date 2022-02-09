import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';
import Answer from './components/Answer';

function App() {
  const [overlay, showOverlay] = useState(true)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [allData, setAllData] = useState([])
  
  useEffect(() => {
      async function fetchQuestions(url) {
          try {
              const res = await fetch(url)
              const data = await res.json()
              setAllData(data.results)
              
          } catch(err) {
              console.log("oops! something happened! ", err)
          }
      }
      
      fetchQuestions(`https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple`)
  }, [])
  
  function startQuiz() {
      showOverlay(prevOverlay => !prevOverlay);
      loadQuestions();
  }
  
  function shuffleArray(arr) {
      return arr.sort(() => Math.random() - 0.5);
  }

  function loadAnswers(arr) {
    const correct = {
      value: arr.correct_answer,
      isSelected: false,
      isCorrect: true,
      id: nanoid()
    };
    const incorrect = arr.incorrect_answers.map(each => ({value: each, isSelected: false, isCorrect: false, id: nanoid()}));
    //collect answers into an array
    const answerArray = [correct, ...incorrect]
    //shuffle the array so that the answer can be in any position
    const shuffleAnswers = shuffleArray(answerArray)
    return shuffleAnswers;
  }

  function loadQuestions() {
    const questionList = allData.map(item => {
        const answerList = loadAnswers(item);
        return { question: item.question, answers: answerList, correctAnswer: item["correct_answer"]}
    })

    setQuestions(questionList);
  }
  
  function changeSelection(arr, id) {    
        return arr.map(item => {
            if (item.id == id) {
               return { ...item, isSelected: true}
            }
            return {...item, isSelected: false}
        })
  }

  function setColor(id) {
    setQuestions(prevQues => {
        return prevQues.map(eachQuestion => {
            const updatedAnswers = changeSelection(eachQuestion.answers, id);
            return { ...eachQuestion, answers: updatedAnswers}
        })
    })
  }

  const questionElements = questions.map(item => {
      //const allAnswers = item.push(...item["answers"])
      //setAnswer(allAnswers);
      const answerEls = item["answers"].map(eachAnswer => {
                            return <Answer ans={eachAnswer.value} 
                            key={eachAnswer.id}
                            isSelected={eachAnswer.isSelected}
                            setColor={() => setColor(eachAnswer.id)}/>
                        })
      return <Question 
              ques={item.question}
              answerElements={answerEls}
              correctAnswer={item.correctAnswer}
          />
    })
  return (
      <main>
          {overlay && <Intro startQuiz={startQuiz}/>}
          <div>{questionElements}</div>
      </main>
             
  )
}

export default App;
