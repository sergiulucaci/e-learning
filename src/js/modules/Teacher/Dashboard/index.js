import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AssignQuiz from '../AssignQuiz';
import QuizzesList from '../Quizzes/List';
import StudentsGrades from '../Grades';

import * as api from '../../../api';

import './style.css';

const quizzes = "quizzes";
const assign = "assignQuiz";
const grades = "studentsGrades";

/**
 * This is a parent component for all sections related to Teacher's module.
 * By default is rendered the list with the Quizzes.
 * Further, the Teacher can choose other section, like Assign or Student's Grades.
 */
export default class TeacherDashboard extends Component {
  /**
   * Initial state.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      subHeaderItemActive: quizzes,
      quizzes: [],
      responses: []
    };
  }

  /**
   * Retrieve Quizzes, Students and Students's Responses from API.
   */
  componentDidMount() {
    this.getQuizzes();
    this.getStudents();
    this.getResponses();
  }

  /**
   * Get Quizzes that belongs to a specific Teacher - Quizzes model will be queried via the teacher id.
   */
  getQuizzes() {
    api
      .getQuizzes({teacherId: this.props.currentUser.id})
      .then(data => {
        this.setState({quizzes: data})
      });
  }

  /**
   * Get Students.
   */
  getStudents() {
    api
      .getStudents()
      .then(data => {
        this.setState({students: data})
      });
  }

  /**
   * Get Students's Responses.
   */
  getResponses() {
    api
      .getResponses({teacherId: this.props.currentUser.id})
      .then(data => {
        this.setState({responses: data});
      });
  }

  /**
   * Choose other section from the the sub-header.
   * Available options: Quizzes | Students's Grades | Assign quiz to student
   * @param item
   */
  changeSubHeaderItem(item) {
    this.setState({subHeaderItemActive: item})
  }

  /**
   * Return sub-header items.
   * @returns {XML}
   */
  renderSubHeader() {
    let activeItem = this.state.subHeaderItemActive;

    return (
      <div className="row teacher-sub-header">
        <div className={`"teacher-sub-header-item col-lg-3 col-lg-offset-2 " ${activeItem === quizzes ? "active" : ""}`}>
          <span onClick={() => this.changeSubHeaderItem(quizzes)}>Quizzes</span>
        </div>
        <div className={`"teacher-sub-header-item col-lg-3 " ${activeItem === grades ? "active" : ""}`}>
          <span onClick={() => this.changeSubHeaderItem(grades)}>Students's Grades</span>
        </div>
        <div className={`"teacher-sub-header-item col-lg-3 " ${activeItem === assign ? "active" : ""}`}>
          <span onClick={() => this.changeSubHeaderItem(assign)}>Assign quiz to student</span>
        </div>
      </div>
    )
  }

  /**
   * Update Teacher's Quiz.
   * @param quiz
   */
  handleUpdateQuiz(quiz) {
    api
      .updateQuiz(quiz)
      .then(() => {
        this.getQuizzes();
      });
  }

  /**
   * Based on the current sub-header item selected, the Quizzes/AssignQuiz/StudentsGrades components will be rendered.
   * @returns {XML}
   */
  renderContent() {
    let props = this.props;
    let state = this.state;
    switch (state.subHeaderItemActive) {
      case quizzes:
        return (
          <QuizzesList
            currentUser={props.currentUser}
            getQuizzes={() => this.getQuizzes()}
            quizzes={state.quizzes}/>
        );
      case assign:
        return (
          <AssignQuiz
            currentUser={props.currentUser}
            quizzes={state.quizzes}
            students={state.students}
            updateQuiz={(quiz) => this.handleUpdateQuiz(quiz)}/>
        );
      case grades:
        return (
          <StudentsGrades
            quizzes={state.quizzes}
            responses={state.responses}
            students={state.students}/>
        );
      default:
        return <div/>
    }
  }

  render() {
    return (
      <div>
        {this.renderSubHeader()}
        <hr/>
        {this.renderContent()}
      </div>
    )
  }
}

TeacherDashboard.propTypes = {
  // Current user that's logged in.
  currentUser: PropTypes.object.isRequired
};
