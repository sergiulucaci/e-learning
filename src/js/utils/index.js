/**
 * This function generates the student's based on its response.
 * NOTE: This function should be generated on the API, but while we're mocking the API, we do it this way.
 * @param questions
 * @param studentsAnswer
 * @returns {number}
 */
export const generateScore = (questions, studentsAnswer) => {
  let studentsCorrectAnswers = 0;
  questions.map(question => {
    // Correct Answer
    let correctAnswer = [];
    question.correctAnswer.map(answer => {
      correctAnswer.push(answer.value);
    });
    // Student's answer
    studentsAnswer.map(answer => {
      if (answer.questionId === question.id) {
        let isCorrect = true;
        // If the user didn't select any response the answer is treated as incorrect.
        if (!answer.selected.length) {
          isCorrect = false;
          // Else if the student's response is incorrect, obviously the answer is incorrect.
        } else {
          // Sort both user answer and correct answer, convert them to string and once there they can be compared.
          let selectedAnswer = answer.selected.sort().toString();
          correctAnswer = correctAnswer.sort().toString();
          if (selectedAnswer !== correctAnswer) {
            isCorrect = false;
          }
        }
        // Increment the correct responses.
        if (isCorrect) {
          studentsCorrectAnswers++;
        }
      }
    });
  });
  // Student's score.
  return studentsCorrectAnswers / questions.length;
};
