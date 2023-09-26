import { component$, useStore, $ } from "@builder.io/qwik";
import { type DocumentHead} from "@builder.io/qwik-city";
import styles from "./quiz.module.css";
import { quiz } from "~/data";

interface QuizStore {
  activeQuestion: number;
  selectedAnswer: any;
  checked: boolean;
  selectedAnswerIndex: null;
  showResult: boolean;
  result: {
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
  }
}

export default component$(() => {
const store = useStore<QuizStore>({
  activeQuestion: 0, selectedAnswer: '', checked: false, selectedAnswerIndex: null,
  showResult: false, result: {
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0
  }
})

const {questions} = quiz
const {question, answers, correctAnswer} = questions[store.activeQuestion];

const onAnswerSelected = $((anwser: any, idx: any) => {
  store.checked = true;
  store.selectedAnswerIndex = idx;
  if (anwser === correctAnswer) {
    store.selectedAnswer = true;
    console.log("true")
  } else {
    store.selectedAnswer = false;
    console.log('false')
  }
});


const nextQuestion = $(() => {
  if (store.selectedAnswer) {
    store.result.score += 5;
    store.result.correctAnswers += 1;
  } else {
    store.result.wrongAnswers += 1;
  }
  
  if (store.activeQuestion !== questions.length - 1) {
    store.activeQuestion += 1;
  } else {
    store.activeQuestion = 0;
    store.showResult = true;
  }
    store.selectedAnswer = null;
    store.checked = false;
});

  return (
    <>
      <div class={styles["container"]}>
        <h1>Quiz Page</h1>
        <div>
        <h2 >
          Question: {store.activeQuestion + 1}
          <span > /{questions.length}</span>
        </h2>
      </div>
      <div>
        {!store.showResult ? (
          <div class={styles["quiz-container"]}>
            <h3 >{questions[store.activeQuestion].question}</h3>
            {answers.map((answer, idx) => (
              <li
                key={idx}
                onClick$={() => onAnswerSelected(answer, idx)}
                class={
                  store.selectedAnswerIndex === idx ? styles['li-selected'] : styles['li-hover']
                }
              >
                <span>{answer}</span>
              </li>
            ))}
            {store.checked ? (
              <button onClick$={nextQuestion} class={styles['btn']}>
                {store.activeQuestion === question.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button onClick$={nextQuestion} disabled class={styles['btn-disabled']}>
                {' '}
                {store.activeQuestion === question.length - 1 ? 'Finish' : 'Next'}
              </button>
            )}
          </div>
        ) : (
          <div class={styles["quiz-container"]}>
            <h3>Results</h3>
            <h3>Overall {(store.result.score / 25) * 100}%</h3>
            <p>
              Total Questions: <span>{questions.length}</span>
            </p>
            <p>
              Total Score: <span>{store.result.score}</span>
            </p>
            <p>
              Correct Answers: <span>{store.result.correctAnswers}</span>
            </p>
            <p>
              Wrong Answers: <span>{store.result.wrongAnswers}</span>
            </p>
            <button onClick$={() => window.location.reload()}>Restart</button>
          </div>
        )}
      </div>
      </div>

    </>
  );
});

export const head: DocumentHead = {
  title: "Quiz app home",
};
