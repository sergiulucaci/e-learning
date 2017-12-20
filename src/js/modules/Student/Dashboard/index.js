import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import QuizzesToBeSolvedList from '../Quizzes/List';
import SolveQuiz from '../Quizzes/SolveQuiz';

import * as api from '../../../api';

import './style.css';

/**
 * This is a parent component for all sections related to Student's module.
 * By default is rendered the list with the Quizzes.
 * From here, the Student can submit quizzes.
 */
export default class StudentDashboard extends Component {
  /**
   * Initial State.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      currentQuizToBeSolved: {
        id: false
      },
      quizzes: [],
      responses: [],
      teachers: []
    };
  }

  /**
   * Retrieve Quizzes, Teachers, Responses from the mocking-API.
   */
  componentDidMount() {
    this.getQuizzes();
    this.getTeachers();
    this.getResponses();
  }

  /**
   * Get Responses that belongs to a specific Student - Responses model will be queried via the student id.
   */
  getResponses() {
    api
      .getResponses({studentId: this.props.currentUser.id})
      .then(data => {
        this.setState({responses: data});
      });
  }

  /**
   * Get Quizzes.
   */
  getQuizzes() {
    api
      .getQuizzes()
      .then(data => {
        let quizzesToBeShown = [];
        // Not to cool, but while there isn't an API for that we manipulate all quizzes on the front.
        data.map(quiz => {
          if (quiz.assignees.includes(this.props.currentUser.id)) {
            quizzesToBeShown.push(quiz);
          }
        });
        this.setState({quizzes: quizzesToBeShown})
      });
  }

  /**
   * Get Teachers.
   */
  getTeachers() {
    api
      .getTeachers()
      .then(data => {
        this.setState({teachers: data})
      });
  }

  /**
   * Once the Student chooses to solve a quiz, the current component's State is updated with the current quiz to be
   * solved. The Quiz Form for Student will appear after a new quiz is stored on state.
   * @param quiz
   */
  handleSolveQuiz(quiz) {
    this.setState({
      currentQuizToBeSolved: quiz
    });
  }

  /**
   * Empty the State from the current quiz. The quizzes list will apear.
   */
  goToQuizzesList() {
    this.setState({
      currentQuizToBeSolved: {
        id: false
      }
    })
  }

  render() {
    let state = this.state;
    return (
      <div>
        {!this.state.currentQuizToBeSolved.id ?
          <QuizzesToBeSolvedList
            quizzes={state.quizzes}
            responses={state.responses}
            solveQuiz={quiz => this.handleSolveQuiz(quiz)}
            teachers={state.teachers}/> :
          <SolveQuiz
            currentUser={this.props.currentUser}
            getQuizzes={() => this.getQuizzes()}
            getResponses={() => this.getResponses()}
            goToQuizzesList={() => this.goToQuizzesList()}
            quiz={state.currentQuizToBeSolved}
            teachers={state.teachers}/>
        }
      </div>
    )
  }
}

StudentDashboard.propTypes = {
  // Current user that's logged in.
  currentUser: PropTypes.object.isRequired
};
