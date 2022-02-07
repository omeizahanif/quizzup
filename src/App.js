import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';
import Answer from './components/Answer';

function App() {
  const [overlay, showOverlay] = useState(true)
  const [questions, setQuestions] = useState([])
  const [allData, setAllData] = useState([])
  
  useEffect(() => {
      async function fetchQuestions(url) {
          try {
              const res = await fetch(url)
              const data = await res.json()
              return setAllData(data.results)
              
          } catch(err) {
              console.log("oops! something happened! ", err)
          }
      }
      
      fetchQuestions(`https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple`)
  }, [])
  
  function startQuiz() {
      showOverlay(prevOverlay => !prevOverlay);
      const questionList = allData.map(item => {
              const answerArray = [item.correct_answer, ...item.incorrect_answers]
              //const shuffleAnswers = shuffleArray(answerArray)
              return <Question 
                      ques={item.question}
                      answerList={
                          answerArray.map(answer => <Answer ans={answer}/>)
                      }
                      correctAnswer={item["correct_answer"]}
                  />
              })
      setQuestions(questionList);
  }
  
  function shuffleArray(arr) {
      return arr.sort(() => Math.random() - 0.5);
  }
  
  
  return (
      <main>
          {overlay && <Intro startQuiz={startQuiz}/>}
          <div>{questions ? questions : "Loading"}</div>
      </main>
             
  )
}

export default App;
