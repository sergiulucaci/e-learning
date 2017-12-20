import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortId from 'shortid';

import QuizForm from '../Form';
import * as api from '../../../../api';

import "./style.css"

/**
 * This component is related to Teacher's Quizzes list.
 */
export default class QuizzesList extends Component {
  /**
   * Initial state.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      currentQuiz: {
        id: false
      }
    };
  }

  /**
   * Return Teacher's quizzes list.
   * @returns {XML}
   */
  renderQuizzes() {
    let props = this.props;
    return (
      <div className="quizzes-list">
        {!props.quizzes.length ?
          <div>Whoops. It seems you didn't create any quiz yet.</div> :
          <div/>
        }
        {props.quizzes.map((quiz, index) => {
          return (
            <div key={quiz.id}>
            <span className=" pointer quiz-item" onClick={() => this.setState({currentQuiz: quiz})}>
              {index + 1}. {quiz.title}
            </span>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * Create new Quiz. At this moment the current Quiz wouldn't be saved until the Teacher submits the form.
   */
  addNewQuiz() {
    this.setState({
      currentQuiz: {
        id: shortId.generate(),
        assignees: [],
        title: "",
        newEntry: true,
        questions: [{id: 1, title: "", options: [{id: 1, title: ""}], correctAnswer: []}]
      }
    })
  }

  /**
   * Go Back to the Teacher's quizzes list.
   */
  goToQuizzesList() {
    this.setState({
      currentQuiz: {
        id: false,
        newEntry: false
      }
    })
  }

  /**
   * Create Quiz for the current Teacher.
   * @param quiz
   */
  handleCreateQuiz(quiz) {
    let props = this.props;
    // Store the teacher id.
    quiz.teacherId = props.currentUser.id;
    // By default, the assignees list is empty
    quiz.assignees = [];
    api
      .createQuiz(quiz)
      .then(() => {
        props.getQuizzes();
        this.goToQuizzesList();
      });
  }

  /**
   * Update Teacher's Quiz.
   * @param quiz
   */
  handleUpdateQuiz(quiz) {
    api
      .updateQuiz(quiz)
      .then(() => {
        this.props.getQuizzes();
        this.goToQuizzesList();
      });
  }

  /**
   * Remove Teacher's Quiz.
   * @param quizId
   */
  handleRemoveQuiz(quizId) {
    api
      .removeQuiz(quizId)
      .then(() => {
        this.props.getQuizzes();
        this.goToQuizzesList();
      });
  }

  render() {
    return (
      <div>
        {!this.state.currentQuiz.id ?
          <div>
            <span className="pointer" onClick={() => this.addNewQuiz()}> + Add new quiz</span>
            {this.renderQuizzes()}
          </div> :
          <QuizForm
            createQuiz={quiz => this.handleCreateQuiz(quiz)}
            currentQuiz={this.state.currentQuiz}
            goToQuizzesList={() => this.goToQuizzesList()}
            removeQuiz={quizId => this.handleRemoveQuiz(quizId)}
            updateQuiz={quiz => this.handleUpdateQuiz(quiz)}
          />
        }
      </div>
    )
  }
}

QuizzesList.propTypes = {
  // Current user that's logged in.
  currentUser: PropTypes.object.isRequired,
  // Function for getting the Teacher's quizzes.
  getQuizzes: PropTypes.func.isRequired,
  // List with Teacher's quizzes.
  quizzes: PropTypes.array.isRequired
};
