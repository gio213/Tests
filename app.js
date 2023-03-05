const urls = {
  generalKnowledge: `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`,
  books: `https://opentdb.com/api.php?amount=10&category=10&difficulty=easy&type=multiple`,
  movie: `https://opentdb.com/api.php?amount=10&category=11&difficulty=easy&type=multiple`,
  boardGames: `https://opentdb.com/api.php?amount=10&category=16&difficulty=easy&type=multiple`,
  computers: `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`,
  math: `https://opentdb.com/api.php?amount=10&category=19&difficulty=medium`,
  sport: `https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple`,
  geography: `https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple`,
  history: `https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple`,
  celebrities: `https://opentdb.com/api.php?amount=10&category=26&difficulty=easy&type=multiple`,
  cars: `https://opentdb.com/api.php?amount=10&category=28&difficulty=easy&type=multiple`,
  cartonAnimations: `https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple`,
  music: `https://opentdb.com/api.php?amount=10&category=12&difficulty=easy`,
};
const radioBtns = document.getElementsByName("0");
const resultDiv = document.getElementById("resultDiv");
let checker = false;

const category = document.getElementById("select"),
  card = document.querySelector(".card"),
  questionDiv = document.getElementById("question"),
  answerDiv = document.getElementById("answer"),
  nextBtn = document.getElementById("nextBtn"),
  resetBtn = document.getElementById("resetBtn");
let selectedCategory = "",
  answersList = [],
  answers = document.getElementById("answers");
card.style.display = "none";
// ძველი ელემენტის წაშლა
function removeOldAnswers() {
  answersList = [];
  answers.innerHTML = "";
}
function removeOldQuestion() {
  questionDiv.innerHTML = "";
}

//ახალი ელემენტის შექმნა
function creteNewElement() {
  answersList.forEach((choice, index) => {
    const newList = document.createElement("li");
    const choiceID = `choice${index}`;
    const choceInputElement = document.createElement("input");
    choceInputElement.setAttribute("type", "radio");
    choceInputElement.setAttribute("name", "0");
    choceInputElement.setAttribute("id", choiceID);
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", choiceID);
    labelElement.textContent = choice;
    newList.appendChild(choceInputElement);
    newList.appendChild(labelElement);
    answers.appendChild(newList);
  });
}

// კატეგორიის შერჩევა
category.addEventListener("change", () => {
  selectedCategory = category.value;

  getquestions(urls[selectedCategory]);
});

// მთავარი ფუნქცია
async function getquestions() {
  let score = 0;
  const response = await fetch(urls[selectedCategory]);
  const data = await response.json();
  if (response.ok) {
    category.disabled = true;
  }

  const question = data.results[0].question;
  if (response.ok) {
    card.style.display = "block";
  }
  // სწორი და არასწორი პასუხის არევა
  answersList.push(data.results[0].correct_answer);
  answersList = answersList.concat(data.results[0].incorrect_answers);
  answersList.sort(() => Math.random() - 0.5);

  questionDiv.innerHTML = question;
  answersList.forEach((choice, index) => {
    const newList = document.createElement("li");
    const choiceID = `choice${index}`;
    const choceInputElement = document.createElement("input");
    choceInputElement.setAttribute("type", "radio");
    choceInputElement.setAttribute("name", "0");
    choceInputElement.setAttribute("id", choiceID);
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", choiceID);
    labelElement.textContent = choice;
    newList.appendChild(choceInputElement);
    newList.appendChild(labelElement);
    answers.appendChild(newList);
    choceInputElement.addEventListener("click", () => {
      if (choceInputElement.checked) {
        checker = true;
      }

      if (choice === data.results[0].correct_answer) {
        score++;
      }
    });
  });

  // შემდეგი კითხვის და პასუხის  მიღება
  let i = 0;
  function increasQuestionIndexByOne() {
    checker = false;
    removeOldAnswers();

    i++;
    const nextQuestion = data.results[i].question;
    let nextAnswersList = [];
    // ახალი პასუხის აჩევა და არევა

    nextAnswersList.push(data.results[i].correct_answer);
    nextAnswersList = nextAnswersList.concat(data.results[i].incorrect_answers);
    nextAnswersList.sort(() => Math.random() - 0.5);

    questionDiv.innerHTML = nextQuestion;
    nextAnswersList.forEach((choice, index) => {
      const newList = document.createElement("li");
      const choiceID = `choice${index}`;
      const choceInputElement = document.createElement("input");
      choceInputElement.setAttribute("type", "radio");
      choceInputElement.setAttribute("name", "0");
      choceInputElement.setAttribute("id", choiceID);
      const labelElement = document.createElement("label");
      labelElement.setAttribute("for", choiceID);
      labelElement.textContent = choice;
      newList.appendChild(choceInputElement);
      newList.appendChild(labelElement);
      answers.appendChild(newList);

      choceInputElement.addEventListener("click", () => {
        if (choceInputElement.checked) {
          checker = true;
        }

        if (choice === data.results[i].correct_answer) {
          score++;
        }
      });
    });

    if (i === Object.keys(data.results).length - 1) {
      nextBtn.style.display = "none";
      resetBtn.style.display = "block";

      removeOldAnswers();
      removeOldQuestion();
      resultDiv.style.display = "flex";

      resetBtn.style.backgroundColor = "#ea1625";
      resetBtn.style.color = "black";
    }
    if (score >= 5) {
      resultDiv.style.backgroundColor = "green";
      resultDiv.textContent = `You are a genius!  Your score is: ${score}/10 🤩 `;
    } else {
      resultDiv.style.backgroundColor = "red";
      resultDiv.textContent = `Sorry, try again !  Your score is: ${score}/10 😕`;
    }
  }
  // შემდეგი კითხვის და პასუხის  ღილაკი

  nextBtn.addEventListener("click", () => {
    if (checker === true) {
      increasQuestionIndexByOne();
    }
  });
}
// გასუფთავების ღილაკი
resetBtn.addEventListener("click", () => {
  location.reload();
  score = 0;
});
