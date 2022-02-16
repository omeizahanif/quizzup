import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';
import Answer from './components/Answer';

function App() {
  const [overlay, showOverlay] = useState(true)
  const [questions, setQuestions] = useState([])
  const [allData, setAllData] = useState([])
  const [style, setStyle] = useState("notSelected")
  const [total, setTotal] = useState(0)
  
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
        const resetSelection = arr.map(item => ({...item, isSelected: false}));    
        return resetSelection.map(item => {
            if (item.id === id) {
                setStyle("selected")
                return { ...item, isSelected: !item.isSelected}
            } else {
                setStyle("notSelected")
                return item;
            }
        })
    }
    
    function findAnswer(arr, id) {
        for (let i =0; i < arr.length; i++) {
            if (arr[i].id === id) {
                return true;
            }
        }
    }

    function setColor(id) {
        //find question that carries the answer with the id
        const currentQuestion = questions.find(question => {
                if (findAnswer(question.answers, id)) {
                    return question;
                }        
        })
        
        //iterate that question and set the color of that answer
        const newQuestions = questions.map(eachQuestion => {
                if (eachQuestion === currentQuestion) {
                    return {...eachQuestion,
                    answers: changeSelection(eachQuestion.answers, id)}           
                } else {
                    return eachQuestion;
                }
            });
        
        setQuestions(newQuestions);   
    }

    function setResultColors(item) {
        if ((item.isSelected && item.isCorrect) 
        || (!item.isSelected && item.isCorrect)) {
            setStyle("correctAnswer");
        } else if (item.isSelected && !item.isCorrect) {
            setStyle("wrongAnswer");
        } else {
            setStyle("notSelected");
        }
    }

    function calcResults(arr) {
        let count = 0;
        arr.forEach(answer => {
            setResultColors(answer);
            if (answer.isSelected && answer.isCorrect) {
                count++;
            }
        })
        return count;
    }

    function submitAnswers() {
        const results = questions.map(eachQuestion => {
            console.log(eachQuestion.correctAnswer);
           return calcResults(eachQuestion.answers)
        });
        
        console.log(results)
    }

    const questionElements = questions.map(item => {
        //const allAnswers = item.push(...item["answers"])
        //setAnswer(allAnswers);
        const answerEls = item["answers"].map(eachAnswer => {
                            return <Answer ans={eachAnswer.value} 
                            key={eachAnswer.id}
                            isSelected={eachAnswer.isSelected}
                            setColor={() => setColor(eachAnswer.id)}
                            className={style}/>
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
        <button onClick={submitAnswers}>Check answers</button>
    </main>
           
    )
}

export default App;
