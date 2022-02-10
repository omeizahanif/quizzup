import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';


function App() {
  const [overlay, showOverlay] = useState(true)
  const [questions, setQuestions] = useState([])

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

  

  function loadQuestions() {
    const questionList = allData.map(item => {
        const answerList = loadAnswers(item);
        return { question: item.question, answers: answerList, correctAnswer: item["correct_answer"]}
        //return { question: item.question, correctAnswer: item["correct_answer"]}
    })

    setQuestions(questionList);
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
  
  function changeSelection(arr, id) {    
        const newArr = arr.map(item => item.isSelected == false);
        
  }

  

  const questionElements = questions.map(item => {
      //const allAnswers = item.push(...item["answers"])
      //setAnswer(allAnswers);
     
      return <Question 
              ques={item.question}
              answerList={item.answers}
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
