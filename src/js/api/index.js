import request from 'superagent';

/**
 * This is a mocking API function that returns the students.
 * @returns {Promise}
 */
export const getStudents = () => {
  return new Promise((resolve, reject) => {
    request
      .get(`http://localhost:3001/students`)
      .end((err, res) => {
        if (!err) {
          resolve(res.body);
        } else {
          reject(err);
        }
      });
  });
};

/**
 * This is a mocking API function that returns the teachers.
 * @returns {Promise}
 */
export const getTeachers = () => {
  return new Promise((resolve, reject) => {
    request
      .get(`http://localhost:3001/teachers`)
      .end((err, res) => {
        if (!err) {
          resolve(res.body);
        } else {
          reject(err);
        }
      });
  });
};


/**
 * This is a mocking API function that returns the quizzes.
 * @param query
 * @returns {Promise}
 */
export const getQuizzes = (query) => {
  return new Promise((resolve, reject) => {
    request
      .get(`http://localhost:3001/quizzes`)
      .query(query)
      .end((err, res) => {
        if (!err) {
          resolve(res.body);
        } else {
          reject(err);
        }
      });
  });
};

/**
 * This is a mocking API function that creates a new quiz.
 * @param quiz
 * @returns {Promise}
 */
export const createQuiz = (quiz) => {
  return new Promise(resolve => {
    request
      .post(`http://localhost:3001/quizzes`)
      .send(quiz)
      .end(() => {
        resolve(true);
      });
  })
};

/**
 * This is a mocking API function that updates a quiz.
 * @param quiz
 * @returns {Promise}
 */
export const updateQuiz = (quiz) => {
  return new Promise(resolve => {
    request
      .put(`http://localhost:3001/quizzes/${quiz.id}`)
      .send(quiz)
      .end(() => {
        resolve(true);
      });
  })
};

/**
 * This is a mocking API function that removes a new quiz.
 * @param quizId
 * @returns {Promise}
 */
export const removeQuiz = (quizId) => {
  return new Promise(resolve => {
    request
      .delete(`http://localhost:3001/quizzes/${quizId}`)
      .end(() => {
        resolve(true);
      });
  })
};

/**
 * This is a mocking API function that gets the responses based on a query.
 * @param query
 * @returns {Promise}
 */
export const getResponses = (query) => {
  return new Promise((resolve, reject) => {
    request
      .get(`http://localhost:3001/responses`)
      .query(query)
      .end((err, res) => {
        if (!err) {
          resolve(res.body);
        } else {
          reject(err);
        }
      });
  });
};

/**
 * This is a mocking API function that updates the student's response for a quiz.
 * @param response
 * @returns {Promise}
 */
export const createResponse = (response) => {
  return new Promise(resolve => {
    request
      .post(`http://localhost:3001/responses/`)
      .send(response)
      .end(() => {
        resolve(true);
      });
  });
};

/**
 * This is a mocking API function that updates the student's response for a quiz.
 * @param response
 * @returns {Promise}
 */
export const updateResponse = (response) => {
  return new Promise(resolve => {
    request
      .put(`http://localhost:3001/responses/${response.id}`)
      .send(response)
      .end(() => {
        resolve(true);
      });
  });
};
