import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import config from '../../../../../config';

import './style.css';

/**
 * This component is related to Student's Quizzes list.
 */
export default class QuizzesToBeSolvedList extends Component {
  /**
   * Return Student's Quizzes list.
   * Each item will consist of Quiz's Tile | Teacher's name | Student's grade (this only if he submitted at least once).
   * @returns {XML}
   */
  renderQuizzes() {
    let props = this.props;
    return (
      <div>
        {props.quizzes.map((quiz, index) => {
          let teachersName;
          let studentsGrade = config.quizUnsolved;
          // Teacher's name.
          props.teachers.map (teacher => {
            if (teacher.id === quiz.teacherId) {
              teachersName = teacher.name;
            }
          });
          // Student's grade.
          props.responses.map (response => {
            if (response.quizId === quiz.id) {
              // Show one decimal.
              if (response.grade || response.grade === 0) {
                studentsGrade = (response.grade).toFixed(1);
              }
            }
          });
          return (
            <div key={index}>
              <h4>#{index + 1}</h4>
              <div className="col-lg-1 quiz-label-title">Quiz title:</div>
              <div className="col-lg-11">{quiz.title}</div>
              <div className="col-lg-1 quiz-label-title">Teacher:</div>
              <div className="col-lg-11">{teachersName}</div>
              {studentsGrade === config.quizUnsolved ?
                <div/> :
                <div>
                  <div className="col-lg-1 quiz-label-title">Your Grade:</div>
                  <div className="col-lg-11">{studentsGrade*100}%</div>
                </div>
              }
              <button className="btn btn-default solve-quiz-control" onClick={() => props.solveQuiz(quiz)}>
                Solve this quiz
              </button>
              <hr/>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    let props = this.props;
    return (
      <div>
        <div className="row ">
          <h4>Quizzes to be solved</h4>
          <hr/>
          {!props.quizzes.length ?
            <div>
              Whoops. It seems no teacher assigned you any quiz. Maybe you're a GURU and you don't need to be evaluated.
            </div> :
            this.renderQuizzes()
          }
        </div>
      </div>
    )
  }
}

QuizzesToBeSolvedList.propTypes = {
  // List with Student's quizzes.
  quizzes: PropTypes.array.isRequired,
  // List with Students's responses.
  responses: PropTypes.array.isRequired,
  // Function for Choosing one Quiz to be solved.
  solveQuiz: PropTypes.func.isRequired,
  // List with Teachers.
  teachers: PropTypes.array.isRequired
};
