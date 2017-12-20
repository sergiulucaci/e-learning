import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import config from '../../../../config';

import './style.css';

/**
 * This component is related to the Student's Grades list.
 */
export default class StudentsGrades extends Component {
  /**
   * Render the Quizzes related to a specific Student.
   * @param student
   * @returns {XML}
   */
  renderQuizzes(student) {
    let props = this.props;
    let quizzesNumber = 0;
    let gradesSum = 0;
    // Check if the current user is assigned to solve any quiz. If not, a default message is shown.
    props.quizzes.map(quiz => {
      if (quiz.assignees.includes(student.id)) {
        quizzesNumber++;
      }
    });
    if (!quizzesNumber) {
      return (
        <div>
          <div className="col-lg-12 info-label">No quiz assigned to this student yet.</div>
          <hr className="col-lg-12 hr"/>
        </div>
      )
    }
    return (
      <div>
        {props.quizzes.map((quiz, index) => {
          // Student's grade.
          let studentsGrade = config.quizUnsolved;
          props.responses.map (response => {
            if (response.quizId === quiz.id && response.studentId === student.id) {
              // Show one decimal.
              if (response.grade || response.grade === 0) {
                gradesSum = gradesSum + response.grade;
                studentsGrade = (response.grade).toFixed(1);
              }
            }
          });
          // If the current quiz is assigned to this Student, that display its stats.
          if (quiz.assignees.includes(student.id)) {
            return (
              <div key={index} className="quiz-stats">
                <div className="col-lg-1 quiz-label-title">Quiz title:</div>
                <div className="col-lg-11">{quiz.title}</div>
                <div className="col-lg-1 quiz-label-title">Grade:</div>
                <div className="col-lg-11">
                  {studentsGrade === config.quizUnsolved ?
                    <div className="info-label">unsolved yet</div> :
                    <div>{studentsGrade*100}%</div>
                  }
                </div>
              </div>
            )
          }
        })}
        <div className="quiz-stats">
          <div className="col-lg-1 quiz-label-title">Average:</div>
          <div className="col-lg-11">{((gradesSum / quizzesNumber) * 100).toFixed(1)}%</div>
        </div>
      </div>
    )
  }

  /**
   * Return Student's name. This function is calling renderQuizzes() for returning the quizzes too.
   * @returns {Array}
   */
  renderStudents() {
    let props = this.props;
    return props.students.map((student, index) => {
      return (
        <div key={index}>
          <h4>{student.name}</h4>
          {this.renderQuizzes(student)}
          <hr/>
        </div>
      );
    })
  }

  render() {
    return (
      <div>
        {this.renderStudents()}
      </div>
    )
  }
}

StudentsGrades.propTypes = {
  // List with Teacher's quizzes.
  quizzes: PropTypes.array.isRequired,
  // List with Students's responses.
  responses: PropTypes.array.isRequired,
  // List with All Students.
  students: PropTypes.array.isRequired,
};
