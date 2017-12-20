import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './style.css';

/**
 * This component is related to the Quizzes list from where Teacher can assign them to Students.
 */
export default class AssignQuiz extends Component {
  /**
   * Once the Teacher updates the assignees multi-select, the current Quiz is directly updated also on the mocking-API.
   * @param quiz
   * @param selectedOption
   */
  onChangeAssignees(quiz, selectedOption) {
    let props = this.props;
    let assignees = [];
    selectedOption.map(student => {
      assignees.push(student.value)
    });
    quiz.assignees = assignees;
    props.updateQuiz(quiz);
  }

  /**
   * Return Quizzes list along with its assignees (or Students).
   * @returns {*}
   */
  renderItems() {
    let props = this.props;

    let options = [];
    props.students.map(student => {
      options.push({label: student.name, value: student.id});
    });

    return props.quizzes.map((quiz, index) => {
      // Multi-Select Options
      let options = [];
      props.students.map(student => {
        if (!quiz.assignees.includes(student.id)) {
          options.push({label: student.name, value: student.id});
        }
      });
      // Multi-Select Values
      let value = [];
      quiz.assignees.map(assigneeId => {
        props.students.map(student => {
          if (assigneeId === student.id) {
            value.push({label: student.name, value: student.id});
          }
        });
      });

      return (
        <div className="row quiz-controls-section" key={quiz.id}>
          <h4>#{index + 1}</h4>
          <div className="col-lg-1 quiz-label-title">Quiz title:</div>
          <div className="col-lg-11">{quiz.title}</div>
          <div className="assignees-section">
            <div className="col-lg-1 quiz-label-title quiz-label-title-assignees">Assignees:</div>
            <div className="col-lg-11">
              <Select
                multi
                onChange={selectedOption => this.onChangeAssignees(quiz, selectedOption)}
                options={options}
                placeholder="Students"
                value={value}/>
            </div>
          </div>
          <hr className="hr-assignee"/>
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        {!this.props.quizzes.length ?
          <div>Whoops. It seems you didn't create any quiz yet.</div> :
          this.renderItems()
        }
      </div>
    )
  }
}

AssignQuiz.propTypes = {
  // List with Teacher's quizzes.
  quizzes: PropTypes.array.isRequired,
  // List with All Students.
  students: PropTypes.array.isRequired,
  // Function for updating the Teacher's quiz - in this case this is related to the assignees (or Students).
  updateQuiz: PropTypes.func.isRequired,
};
