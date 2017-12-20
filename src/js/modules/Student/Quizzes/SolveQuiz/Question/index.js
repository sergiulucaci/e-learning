import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';

/**
 * This component is related to the Quiz's Question item that can be manipulated by the Student.
 */
export default class QuestionForm extends Component {
  /**
   * Return available Options for current Question to be chosen.
   * @returns {*}
   */
  renderOptions() {
    let props = this.props;

    return props.currentQuestion.options.map(option => {
      // Check if the current option is already checked by the student.
      let optionValue = props.studentsAnswer.includes(option.id);
      return (
        <div className="quiz-option" key={option.id}>
          <input
            className="form-check-input pointer"
            onChange={e => props.onChangeAnswer(props.currentQuestion.id, option.id, e.target.checked)}
            type="checkbox"
            checked={optionValue}/>
          <span onClick={() => props.onChangeAnswer(props.currentQuestion.id, option.id, !optionValue)}>
            &nbsp;&nbsp;{option.title}
          </span>
        </div>
      );
    });
  }

  render() {
    let props = this.props;
    let options = [];
    props.currentQuestion.options.map(option => {
      options.push({label: option.title, value: option.id});
    });

    return (
      <div>
        <h4>{props.index}. {props.currentQuestion.title}</h4>
        <div className="options">
          {this.renderOptions()}
        </div>
        <hr/>
      </div>
    )
  }
}

QuestionForm.propTypes = {
  // Current Quiz's Question.
  currentQuestion: PropTypes.object.isRequired,
  // Function for changing Student's Answer.
  onChangeAnswer: PropTypes.func.isRequired,
  // List with the Student's answer.
  studentsAnswer: PropTypes.array.isRequired
};
