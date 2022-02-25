import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { decode } from "html-entities"
import './App.css';
import Intro from './components/Intro';
import Question from './components/Question';
import Answer from './components/Answer';

function App() {
  const [overlay, showOverlay] = useState(true)
  const [questions, setQuestions] = useState([])
  const [allData, setAllData] = useState([])
  const [total, setTotal] = useState(0)
  const [quiz, setQuiz] = useState(false)
  
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
      
  }, [quiz])
  
    function startQuiz() {
        showOverlay(prevOverlay => !prevOverlay);
        loadQuestions(allData);
        setQuiz(false)
        setTotal(0)
    }

    /**
     * a function to shuffle items, placing them
     * in different indexes
     * @param {object} arr 
     * @returns {object} a shuffled arr
     */
    function shuffleArray(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    /**
     * 
     * @param {object} arr 
     * @returns {object} an arr of answers
     * shuffled to hide correct answer position
     */

    function loadAnswers(arr) {
        const correct = {
            value: decode(arr.correct_answer),
            isSelected: false,
            className: "notSelected",
            id: nanoid()
        };
        const incorrect = arr.incorrect_answers.map(each => ({value: decode(each), isSelected: false, className: "notSelected", id: nanoid()}));
        //collect answers into an array
        const answerArray = [correct, ...incorrect]
        //shuffle the array so that the answer can be in any position
        const shuffleAnswers = shuffleArray(answerArray)
        return shuffleAnswers;
    }

    /**
     * a function to prepare a list
     * of questions and set the questions state
     * @param {object} arr
     * @returns {boolean} true value if call is
     * successful
     */
    function loadQuestions(arr) {
        const questionList = arr.map(item => {
            const answerList = loadAnswers(item);
            return { question: decode(item.question), answers: answerList, correctAnswer: item["correct_answer"]}
        })
        setQuestions(questionList);
        return true;
    }

    /**
     * a function to toggle the color of each answer
     * component when clicked
     * @param {object} arr 
     * @param {string} id 
     * @returns {object} an object mutated or the object unchanged
     */

    function changeSelection(arr, id) {
        const resetSelection = arr.map(item => ({...item, isSelected: false, className: "notSelected"}));    
        return resetSelection.map(item => {
            if (item.id === id) {
                //setStyle("selected")
                return { ...item, isSelected: !item.isSelected, className: "selected"}
            } else {
                //setStyle("notSelected")
                return item;
            }
        })
    }

    /**
     * a function to find an answer object
     * by comparing its id with a given id
     * @param {object} arr 
     * @param {string} id 
     * @returns {boolean} true value
     * 
     */
    
    function findAnswer(arr, id) {
        for (let i =0; i < arr.length; i++) {
            if (arr[i].id === id) {
                return true;
            }
        }
    }

    /**
     * a function to set the color of an answer
     * component if its id is same as given id parameter
     * and update the questions state
     * @param {string} id 
     * @returns {boolean} true value
     */
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
        return true;   
    }

    /**
     * a function to set appropriate colors
     * for the right, wrong and unselected answers
     * @param {object} arr 
     * @param {string} correctAnswer 
     * @returns {object} updated arr object 
     */

    function setResultColors(arr, correctAnswer) {
        return arr.map(item => {
            const itemIsCorrect = item.value == correctAnswer;
            if (!itemIsCorrect) {
                return item.isSelected ? { ...item, className: "is_wrong"} : item;
                
            } else {
                return { ...item, className: "is_correct"}
            }
        })
    }

    /**
     * a function to calculate the final
     * results of the quiz
     * @param {object} arr 
     * @param {string} correctAnswer 
     * @returns {number} count
     */

    function calcResults(arr, correctAnswer) {
        let count = 0;
        arr.forEach(answer => {
            if (answer.isSelected && (answer.value == correctAnswer)) {
                count++;
            }
        })
        return count;
    }

    /**
     * a function to submit the answers 
     * selected after the quiz ends and
     * set the questions and total states
     */
    function submitAnswers() {
        
        const results = questions.map(eachQuestion => {
           return calcResults(eachQuestion.answers, eachQuestion.correctAnswer)
        });

        const updatedQuestions = questions.map(eachQuestion => {
            return {...eachQuestion,
                answers: setResultColors(eachQuestion.answers, eachQuestion.correctAnswer)} 
         });

        setQuestions(updatedQuestions);
        setTotal(results.reduce((acc, curr) => acc + curr, 0));
        setQuiz(true)

    }

    function checkGameStatus() {
        return quiz ? startQuiz() : submitAnswers();
    }

    const questionElements = questions.map(item => {
        const answerEls = item["answers"].map(eachAnswer => {
                            return <Answer ans={eachAnswer.value} 
                            key={eachAnswer.id}
                            isSelected={eachAnswer.isSelected}
                            setColor={() => setColor(eachAnswer.id)}
                            className={eachAnswer.className}/>
                        })
        return <Question 
                ques={item.question}
                answerElements={answerEls}
                correctAnswer={item.correctAnswer}
            />
    })

  return (
    <main className='container'>
        {overlay && <Intro startQuiz={startQuiz}/>}
        {!overlay && <div className='questionContainer'>{questionElements}</div>}
        {!overlay && <div className='status'>
            <button 
        onClick={checkGameStatus}
        className="submit"
        >{quiz ? "Play again" : "Check answers"}</button>
        {quiz && <p className='statusMessage'>{`You scored ${total}/5 correct answers`}</p>}
        </div>}
    </main>
           
    )
}

export default App;
