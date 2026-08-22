// Self-check quiz widget. NOT connected to any gradebook — everything runs
// in the browser and resets on reload. Just instant feedback for practice.
//
// Usage: build a <div class="quiz" data-quiz='[...]'></div> where the
// data-quiz attribute is a JSON array of question objects:
// [
//   {
//     "question": "What launch angle maximizes range (no air resistance)?",
//     "choices": ["30°", "45°", "60°", "90°"],
//     "correctIndex": 1,
//     "explanation": "45° splits the launch velocity evenly between horizontal
//        and vertical components, which maximizes range on level ground."
//   }
// ]
(function () {
  function buildQuiz(container) {
    var raw = container.getAttribute("data-quiz");
    var questions;
    try {
      questions = JSON.parse(raw);
    } catch (e) {
      container.innerHTML = "<p class='no-results'>Quiz data could not be read. Check the JSON in data-quiz.</p>";
      return;
    }

    var answered = new Array(questions.length).fill(false);
    var correctCount = 0;

    var scoreEl = document.createElement("p");
    scoreEl.className = "quiz-score";

    questions.forEach(function (q, qIndex) {
      var qBlock = document.createElement("div");
      qBlock.className = "quiz-question";

      var qText = document.createElement("p");
      qText.className = "q-text";
      qText.textContent = (qIndex + 1) + ". " + q.question;
      qBlock.appendChild(qText);

      var list = document.createElement("ul");
      list.className = "quiz-options";
      var name = "quiz-" + Math.random().toString(36).slice(2) + "-" + qIndex;

      var feedback = document.createElement("div");
      feedback.className = "quiz-feedback";

      q.choices.forEach(function (choiceText, cIndex) {
        var li = document.createElement("li");
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = name;
        input.value = String(cIndex);

        input.addEventListener("change", function () {
          if (answered[qIndex]) return; // one check per question, like a real self-check
          answered[qIndex] = true;

          var allLabels = list.querySelectorAll("label");
          allLabels.forEach(function (l) { l.classList.remove("is-correct", "is-incorrect"); });

          var isCorrect = cIndex === q.correctIndex;
          if (isCorrect) {
            label.classList.add("is-correct");
            correctCount += 1;
          } else {
            label.classList.add("is-incorrect");
            var correctLabel = list.children[q.correctIndex].querySelector("label");
            correctLabel.classList.add("is-correct");
          }

          feedback.textContent = (isCorrect ? "Correct. " : "Not quite. ") + (q.explanation || "");
          feedback.classList.add("is-visible", isCorrect ? "is-correct" : "is-incorrect");

          list.querySelectorAll("input").forEach(function (i) { i.disabled = true; });

          scoreEl.textContent = "Score: " + correctCount + " / " + questions.length;
        });

        label.appendChild(input);
        var span = document.createElement("span");
        span.textContent = choiceText;
        label.appendChild(span);
        li.appendChild(label);
        list.appendChild(li);
      });

      qBlock.appendChild(list);
      qBlock.appendChild(feedback);
      container.appendChild(qBlock);
    });

    scoreEl.textContent = "Score: 0 / " + questions.length;
    container.appendChild(scoreEl);

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn";
    resetBtn.textContent = "Try again";
    resetBtn.style.marginTop = "0.5rem";
    resetBtn.addEventListener("click", function () {
      container.innerHTML = "";
      answered = new Array(questions.length).fill(false);
      correctCount = 0;
      buildQuiz(container);
    });
    container.appendChild(resetBtn);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".quiz[data-quiz]").forEach(buildQuiz);
  });
})();
