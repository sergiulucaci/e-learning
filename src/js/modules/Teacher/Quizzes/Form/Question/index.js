import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommonInput from '../../../../../components/Input';
import Select from 'react-select';

import './style.css';

/**
 * This component is related to the Teacher's Quiz's Question, where the Teacher can add/update/remove the questions.
 * This component is also related to the Teacher's Quiz's Question's Options.
 */
export default class QuestionForm extends Component {
  /**
   * This function is called when the Quiz's Questions fields (for now, just <<title>> key) are updating.
   * At his turn, this function triggers the parent function for updating Question's fields.
   * @param path
   * @param value
   */
  onChangeQuestion(path, value) {
    let props = this.props;
    props.updateQuestion(props.id, path, value);
  }

  /**
   * This function is called when the Quiz's Question's Option are updating.
   * At his turn, the function trigger the parent function for updating Question's Option.
   * @param optionId
   * @param path
   * @param value
   */
  onChangeQuestionsOption(optionId, path, value) {
    let props = this.props;
    props.updateQuestionsOption(props.id, optionId, path, value);
  }

  /**
   * This function triggers the remove Question Options function.
   * @param optionId
   */
  removeOption(optionId) {
    let props = this.props;
    props.removeQuestionsOption(props.id, optionId);
  }

  /**
   * Return Remove Option Button.
   * @param optionId
   * @returns {XML}
   */
  renderRemoveOptionIcon(optionId) {
    return (
      <button disabled={this.props.disabled} className="btn btn-default" onClick={() => this.removeOption(optionId)}>
        Remove Option
      </button>
    )
  }

  /**
   * Return Question's Options.
   * @returns {*}
   */
  renderOptions() {
    let props = this.props;
    let options = props.currentQuestion.options;
    return options.map(option => {
      return (
        <div className="quiz-option" key={option.id}>
          <CommonInput
            disabled={props.disabled}
            rightItem={this.renderRemoveOptionIcon(option.id)}
            onChange={e => this.onChangeQuestionsOption(option.id, 'title', e.target.value)}
            placeholder={'Question\'s option'}
            value={option.title}/>
        </div>
      );
    });
  }

  /**
   * This function is trigger when the Question's Answer is updating.
   * At his turn, this function triggers the Update Question's Answer function.
   * @param selectedOption
   */
  onChangeQuestionsAnswer(selectedOption) {
    let props = this.props;
    props.updateQuestionsAnswer(props.id, selectedOption);
  }

  /**
   * This function triggers the remove Question function.
   */
  removeQuestion() {
    let props = this.props;
    props.removeQuestion(props.id)
  }

  render() {
    let props = this.props;
    let options = [];
    props.currentQuestion.options.map(option => {
      options.push({label: option.title, value: option.id});
    });

    return (
      <div>
        <h4>#{props.index}</h4>
        <h5>Title</h5>
        <CommonInput
          disabled={props.disabled}
          value={props.currentQuestion.title}
          onChange={e => this.onChangeQuestion('title', e.target.value)}
          placeholder={'Question\'s title'}/>
        <h5>Options</h5>
        {!props.disabled ?
          <h5 className="pointer" onClick={() => props.addNewOption(props.id)}> + Add new option</h5> :
          <div/>
        }
        {this.renderOptions()}
        <h5>Correct Answers</h5>
        <Select
          multi
          disabled={props.disabled}
          onChange={selectedOption => this.onChangeQuestionsAnswer(selectedOption)}
          options={options}
          placeholder="Correct Answer"
          value={props.currentQuestion.correctAnswer}/>
        <button disabled={props.disabled} className="btn btn-default question-control" onClick={() => this.removeQuestion()}>
          Remove Question
        </button>
        <br/>
        <hr className="hr-question"/>
      </div>
    )
  }
}

QuestionForm.propTypes = {
  // Function for pushing a new Option for the current Question.
  addNewOption: PropTypes.func.isRequired,
  // Current Quiz's Question.
  currentQuestion: PropTypes.object.isRequired,
  // Boolean value that is related to the Update / Remove permissions (<<false>> if the current quiz is assigned).
  disabled: PropTypes.bool.isRequired,
  // Current Quiz's Question's id.
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  // Function for removing the current Question.
  removeQuestion: PropTypes.func.isRequired,
  // Function for removing the current Question's Option.
  removeQuestionsOption: PropTypes.func.isRequired,
  // Function for updating the current Question.
  updateQuestion: PropTypes.func.isRequired,
  // Function for updating the current Question's Option's Answer.
  updateQuestionsAnswer: PropTypes.func.isRequired,
  // Function for updating the current Question's Option.
  updateQuestionsOption: PropTypes.func.isRequired,
};
