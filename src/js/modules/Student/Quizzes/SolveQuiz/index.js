import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { generateScore } from '../../../../utils';
import Question from './Question';
import shortId from 'shortid';

import * as api from '../../../../api';

/**
 * This component is related to the Student's Quiz Form, from where the Student can solve the current Quiz.
 */
export default class SolveQuiz extends Component {
  /**
   * Initial State.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      // This looks like a default state for a quiz response.
      quizResponse: {
        id: false,
        quizId: false,
        studentId: false,
        answers: []
      }
    };
  }

  /**
   * Get the quiz's response, either the responses are received in the previous component because of the different treat
   * (like new quiz responses for e.g).
   */
  componentDidMount() {
    this.getResponses();
  }

  /**
   * Get Responses that belongs to the current Student - Responses model will be queried via the student id.
   */
  getResponses() {
    let props = this.props;
    api
      .getResponses({quizId: props.quiz.id, studentId: props.currentUser.id})
      .then(data => {
        let quizResponse;
        // If the response is a new one, generate an empty Response model.
        if (!data.length) {
          quizResponse = {
            id: shortId.generate(),
            quizId: props.quiz.id,
            studentId: props.currentUser.id,
            newEntry: true,
            answers: props.quiz.questions.map(question => {
              return {
                questionId: question.id,
                selected: []
              }
            })
          };
          // Else if new questions were added to the quiz
        } else {
          quizResponse = data[0];
        }
        this.setState({quizResponse: quizResponse});
      });
  }

  /**
   * Once the Student updates the current answer, the State is update too (more specific <<quizResponse>> key).
   * @param questionId
   * @param optionId
   * @param value
   */
  handleOnChangeAnswer(questionId, optionId, value) {
    let state = this.state;
    this.setState({
      quizResponse: {
        ...state.quizResponse,
        answers: state.quizResponse.answers.map(answer => {
          if (answer.questionId === questionId) {
            // Update answer based on the student's action.
            if (value) {
              answer.selected.push(optionId);
            } else {
              answer.selected.splice(answer.selected.indexOf(optionId), 1);
            }
          }
          return answer;
        })
      }
    })
  }

  /**
   * Return Quiz's Questions.
   * @returns {Array}
   */
  renderQuestions() {
    let props = this.props;
    let state = this.state;
    return props.quiz.questions.map((question, index) => {
      let studentsAnswer = [];
      state.quizResponse.answers.map(answer => {
        if (answer.questionId === question.id) {
          studentsAnswer = answer.selected;
        }
      });
      return (
        <Question
          addNewOption={questionId => this.addNewOption(questionId)}
          currentQuestion={question}
          index={index + 1}
          key={question.id}
          onChangeAnswer={(qId, optId, value) => this.handleOnChangeAnswer(qId, optId, value)}
          quizId={props.quiz.id}
          studentsAnswer={studentsAnswer}/>
      );
    });
  }

  /**
   * Create new Response or Update an existing one.
   */
  submitResponse() {
    let props = this.props;
    let state = this.state;
    // Teacher's id.
    props.teachers.map (teacher => {
      if (teacher.id === props.quiz.teacherId) {
        state.quizResponse.teacherId = teacher.id;
      }
    });
    // Calculate the grade of the Student.
    // NOTE: This should be solved on the API, but once API is mocked, is generated this way.
    state.quizResponse.grade = generateScore(props.quiz.questions, state.quizResponse.answers);
    if (this.state.quizResponse.newEntry) {
      this.createResponse(state.quizResponse);
    } else {
      this.updateResponse(state.quizResponse);
    }
  }

  /**
   * Create Student's Response.
   * The <<newEntry>> field is removed here, we don't needed in our mocking-DB.
   * @param quizResponse
   */
  createResponse(quizResponse) {
    let props = this.props;
    // Remove the <<newEntry>> key
    delete quizResponse.newEntry;
    api
      .createResponse(quizResponse)
      .then(() => {
        props.getQuizzes();
        props.getResponses();
        props.goToQuizzesList();
      });
  }

  /**
   * Update Student's Response.
   * @param quizResponse
   */
  updateResponse(quizResponse) {
    let props = this.props;
    api
      .updateResponse(quizResponse)
      .then(() => {
        props.getQuizzes();
        props.getResponses();
        props.goToQuizzesList();
      });
  }

  render() {
    let props = this.props;
    return (
      <div>
        <button className="btn btn-default" onClick={() => props.goToQuizzesList()}>Go back</button>
        <hr/>
        {!props.quiz.questions.length ?
          <div>Whoops. It seems that this quiz doesn't have any question yet.</div> :
          <div>{this.renderQuestions()}</div>
        }
        <button className="btn btn-default" onClick={() => this.submitResponse()}>Submit Quiz</button>
      </div>
    )
  }
}

SolveQuiz.propTypes = {
  // Current user that's logged in.
  currentUser: PropTypes.object.isRequired,
  // Function for retrieving the Student's Quizzes.
  getQuizzes: PropTypes.func.isRequired,
  // Function for retrieving the Student's Responses.
  getResponses: PropTypes.func.isRequired,
  // Function for Going Back to Student's Quizzes list.
  goToQuizzesList: PropTypes.func.isRequired,
  // Current Quiz to be solved.
  quiz: PropTypes.object.isRequired,
  // List with Teachers.
  teachers: PropTypes.array.isRequired
};
