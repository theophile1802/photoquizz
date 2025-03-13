import "./style.css";
import { Questions } from "./questions";

const app = document.querySelector("#app");
const startButton = document.querySelector("#start");
startButton.addEventListener("click", startQuizz);

function startQuizz(event) {
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function displayQuestion(index) {
    clean();
    function clean() {
      while (app.firstElementChild) {
        app.firstElementChild.remove();
      }
      if (currentQuestion < Questions.length) {
        const progression = getProgression(
          Questions.length,
          currentQuestion + 1
        );
        app.appendChild(progression);
      }
    }

    const question = Questions[index];

    if (!question) {
      const endMessage = showEndMessage(score, Questions.length);
      app.appendChild(endMessage);
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answerDiv = displayAnswer(question.answers);
    app.appendChild(answerDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);
    app.appendChild(submitButton);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, value, question.correct);
    const feedback = getFeedbackMessage(isCorrect, question.correct);
    app.appendChild(feedback);
    currentQuestion++;
    makeSubmitDisapear(currentQuestion);

    function makeSubmitDisapear(currentQuestion) {
      const timeout = 2000;
      setTimeout(() => {
        displayQuestion(currentQuestion);
      }, timeout);
      app.querySelector("button").remove();
    }
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  text.replaceAll(" ", "-").toLowerCase();
  return text;
}

function getAnswerElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);
  label.appendChild(input);
  return label;
}

function displayAnswer(answers) {
  const answerDiv = document.createElement("div");
  answerDiv.classList.add("answer");
  for (const answer of answers) {
    const label = getAnswerElement(answer);
    answerDiv.appendChild(label);
  }
  return answerDiv;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function getFeedbackMessage(isCorrect, correctValue) {
  const feedback = document.createElement("p");
  const text = isCorrect
    ? `Bravo, bonne réponse`
    : `Faux, la bonne réponse est ${correctValue}`;
  feedback.innerHTML = text;
  return feedback;
}

function showFeedback(isCorrect, selectedAnswer, correctAnswer) {
  const correctAnswerId = formatId(correctAnswer);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(selectedAnswer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function showEndMessage(score, numberOfQuestions) {
  const h1 = document.createElement("h1");
  h1.innerText = `Quiz terminé !`;
  const p = document.createElement("p");
  p.innerText = `Votre score est de ${score}/${numberOfQuestions}`;
  const div = document.createElement("div");
  div.appendChild(h1);
  div.appendChild(p);
  return div;
}

function getProgression(numberOfQuestions, currentQuestion) {
  const text = document.createElement("h2");
  text.innerText = `Question ${currentQuestion}/${numberOfQuestions}`;
  return text;
}
