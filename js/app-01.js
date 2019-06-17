'use strics';
import { quizData } from './quiz-data.js';

// добавляю основной заголовок тестам
const mainTitle = document.querySelector('.mainTitle');
mainTitle.textContent = quizData.title;

// класс для сборки вопросов и вариантов ответа из массива
class QuizMapper {
  constructor(questions = []) {
    this._questions = questions;

    this.renderQuestionsToPage = function() {
      let fullRenderedArray = [];

      questions.map((value, idx) => {
        fullRenderedArray.push(
          this.createSectionAndSetData(questions[idx], idx + 1),
        );
      });

      const renderedQuestions = fullRenderedArray.join('');
      document
        .querySelector('form')
        .insertAdjacentHTML('afterbegin', renderedQuestions);
    };

    this.createSectionAndSetData = function({ question, choices }, counter) {
      return `
        <section>
            <h3>${counter}. ${question}</h3>
            <ol>${this.createLiAndSetData(choices, counter)}</ol>
        </section>
        `;
    };

    this.createLiAndSetData = function(choices, mainQuestionCounter) {
      let anwsersList = [];
      choices.map((value, idx) => {
        const liElement = `
        <li>
            <label>
              <input type="radio" name="${mainQuestionCounter -
                1}" value="${idx}" />
              ${choices[idx]}
            </label>
        </li>
        `;
        anwsersList.push(liElement);
      });
      return anwsersList.join('');
    };
  }
}

const newQuizMapper = new QuizMapper(quizData.questions);
newQuizMapper.renderQuestionsToPage();

// обработка данных после отправки ответов
const submitedForm = document.querySelector('.js-submit-form');
submitedForm.addEventListener('submit', submitEvent);

function renderResultMessage(message) {
  const messText = `<p>${message}</p>`;
  document.querySelector('form').insertAdjacentHTML('beforeend', messText);
}

function submitEvent(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  let questions = quizData.questions;
  let correctAnswersCounter = 0;

  formData.forEach((value, name) => {
    if (Number(value) === questions[Number(name)].answer) {
      correctAnswersCounter++;
    }
  });

  let percent = Math.floor((correctAnswersCounter / questions.length) * 100);
  if (percent >= 80) {
    renderResultMessage(
      `УРА! Поздравляем! <br>Вы прошли тест на базовый уровень JavaScript. Ваш результат ${percent} %`,
    );
  } else {
    renderResultMessage(
      `Пробуйте еще, НЕ достаточно правильных ответов для прохождения теста, <br>Ваш результат ${percent} %.`,
    );
  }
}
