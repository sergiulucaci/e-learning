/**
 * Please use your most proficient programming language to create oop design and use test driven development to
 * implement classes and methods with appropriate data structure and test the code for the following scenario.
 * Please add comments describing any assumptions you make:
 *
 * There are Teachers
 * There are Students
 * Students are in classes that teachers teach
 * Teachers can create multiple quizzes with many questions (each question is multiple choice)
 * Teachers can assign quizzes to students
 * Students solve/answer questions to complete the quiz, but they don't have to complete it at once. (Partial
 * submissions can be made).
 * Quizzes need to get graded.
 * For each teacher, they can calculate each student's total grade accumulated over a semester for their classes.
 */

import { render } from 'react-dom';
import React, { Component } from 'react';

import config from '../config';
import Header from './components/Header';
import StudentDashboard from './modules/Student/Dashboard';
import TeacherDashboard from './modules/Teacher/Dashboard';

import * as api from './api';

import "../css/style.css"
import 'react-select/dist/react-select.css'; // react-select style.

/**
 * Main Component.
 */
class App extends Component {
  /**
   * Initial State.
   */
  constructor() {
    super();
    let currentUser = JSON.parse(localStorage.getItem(config.authKey));
    let emptyUser = {
      id: false,
      isTeacher: false,
      name: ""
    };

    this.state = {
      currentUser: currentUser || emptyUser,
      students: [],
      teachers: [],
    }
  }

  /**
   * Retrueve Students and Teachers from mocking-API.
   */
  componentDidMount() {
    api
      .getStudents()
      .then(data => {
        this.setState({students: data})
      });
    api
      .getTeachers()
      .then(data => {
        this.setState({teachers: data})
      });
  }

  /**
   * Impersonate user.
   * @param user
   * @param isTeacher
   */
  login(user, isTeacher) {
    // Store session for the current user.
    localStorage.setItem(config.authKey, JSON.stringify({...user, isTeacher}));
    this.setState({currentUser: {...user, isTeacher}})
  }

  /**
   * Returns the Teachers's list.
   * @returns {XML}
   */
  renderTeachers() {
    return (
      <div>
        {this.state.teachers.map((teacher, index) => {
          return (
            <div key={teacher.id}>
            <span
              className="user-item"
              onClick={() => this.login(teacher, true)}
              title="Impersonate user">
              {index + 1}. {teacher.name}
            </span>
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * Returns the Student's list.
   * @returns {XML}
   */
  renderStudents() {
    return (
      <div>
        {this.state.students.map((student, index) => {
          return (
            <div
              className="user-item"
              key={student.id}
              onClick={() => this.login(student, false)}
              title="Impersonate user">
              <span>{index + 1}. </span>
              {student.name}
            </div>
          )
        })}
      </div>
    )
  }

  /**
   * Return both Teachers and Students.
   * @returns {XML}
   */
  renderContent() {
    let state = this.state;

    if (state.currentUser.id) {
      return (
        <div>
          {state.currentUser.isTeacher ?
            <TeacherDashboard currentUser={state.currentUser}/> :
            <StudentDashboard currentUser={state.currentUser}/>
          }
        </div>
      )
    }
    return (
      <div>
        <div>Choose the person you'd like to impersonate by clicking it</div>
        <h3>Teachers</h3>
        {this.renderTeachers()}
        <h3>Students</h3>
        {this.renderStudents()}
      </div>
    )
  }

  logout() {
    // Remove session for the current user
    localStorage.removeItem(config.authKey);
    this.setState({currentUser: {id: false, name: ""}})
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} handleLogout={() => this.logout()}/>
        <div className="base">
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('app'));
