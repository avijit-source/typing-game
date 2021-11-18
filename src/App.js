import { useState, useEffect, useRef } from 'react';
import randomWords from 'random-words';
import './App.css';
const MAX_WORDS = 200;
const seconds = 60;


function App() {
  const [ words, setWord ] = useState([]);
  const [countDown , setCountDown] = useState(seconds);
  const [ currInput, setCurrInput ] = useState("");
  const [ currWordIndex , setCurrWordIndex ] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [ correctWord ,setCorrectWord ] = useState(0);
  const [ incorrectWord , setIncorrectWord ] = useState(0);
  const [status,setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(()=>{
    if(status === "started"){
      textInput.current.focus()
    }
  },[status])

  useEffect(() => {
    setWord(generateWords())
  },[])

  function generateWords(){
    return new Array(MAX_WORDS).fill(null).map(()=>randomWords())
  }
  
  function start() {
    if(status === "finished"){
      setWord(generateWords());
      setCurrWordIndex(0);
      setCorrectWord(0);
      setIncorrectWord(0);
      setCurrCharIndex(-1)
      setCurrChar("")
    }
    if(status !== "started"){
      setStatus("started");
      let interval = setInterval(()=>{
        setCountDown( (prevCountDown) => {
          if(prevCountDown === 0){
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return seconds;
          }else{
            return prevCountDown - 1;
          }
        } )
      } ,1000)
    }
  }

  function handleKeyDown({ keyCode , key }) {
     if(keyCode === 32){
       checkWord();
       setCurrInput("");
       setCurrWordIndex( currWordIndex+1 );
       setCurrCharIndex(-1);
     }else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkWord(){
    const word = words[currWordIndex];
    const matchWord = word === currInput.trim();
    matchWord ? setCorrectWord(correctWord+1) : setIncorrectWord(incorrectWord+1);
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if (char === currChar) {
        return 'has-background-success'
      } else {
        return 'has-background-danger'
      }
    } else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
      return 'has-background-danger'
    } else {
      return ''
    }
  }

  return (
    <div className="App">
   <h1 className="neon is-size-1 p-4">Typing Game</h1>
      <div className="box">
      <div className="section">
        <div className="is-size-1 has-text-centered">
          <h2 className="has-text-weight-medium">{countDown}</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input type="text"
         className="input is-rounded is-danger"
         onKeyDown={handleKeyDown}
         value={currInput}
         disabled={status !== "started"}
         ref={textInput}
         onChange={(e) => setCurrInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-danger is-rounded is-fullwidth has-text-weight-medium is-size-5" onClick={start}>
          START
        </button>
      </div>
      </div>
      {status === "started" && (
        <div className="section">
        <div className="card has-background-primary-light">
          <div className="card-content">
            <div className="content has-text-weight-medium is-size-5 has-text-black">
              {words.map((word,i)=>(
                <span key={i}>
                <span>
                  {word.split("").map((char,idx)=>(
                    <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                  ))}
                </span>
                <span> </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
      
      {status === "finished" && (
        <div className="section">
        <div className="columns">
          <div className="column has-text-centered">
            <div className="box">
            <p className="is-size-5 has-text-weight-medium">words per minute:</p>
            <p className="is-size-1 has-text-black">
              {correctWord}
            </p>
            </div>
          </div>
          <div className="column has-text-centered">
            <div className="box">
            <div className="is-size-5 has-text-weight-medium">
             Accuracy:
            </div>
            <p className="has-text-black is-size-1">
              {Math.round((correctWord / (correctWord+incorrectWord) )*100 )}%
            </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default App;
