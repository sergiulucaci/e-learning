import { render } from 'react-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommonInput from '../../../../components/Input';
import Question from './Question';

import './style.css'

/**
 * This component is related to the Teacher's Quiz form, where the Teacher can create new or update an existing form.
 * NOTE: keep in mention that if the current Quiz is assigned at least to one Student, than it can't be updated.
 */
export default class QuizForm extends Component {
  /**
   * Initial state.
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      currentQuiz: props.currentQuiz
    };
  }

  /**
   * Once fields (for now, just <<title>>) are updated, the state (more specific, <<currentQuiz>> key) is updated too.
   * @param path
   * @param value
   */
  onChange(path, value) {
    this.setState({currentQuiz: {...this.state.currentQuiz, [path]: value}});
  }

  /**
   * This function is called when the Quiz's Questions are updated.
   * <<currentQuiz>> key from the State is updated.
   * @param questionId
   * @param path
   * @param value
   */
  handleUpdateQuestion(questionId, path, value) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.map(question => {
          if (question.id === questionId) {
            question[path] = value;
          }
          return question;
        })
      }
    });
  }

  /**
   * This function is called when the Quiz's Question's Options are updated.
   * <<currentQuiz>> key from the State is updated.
   * @param questionId
   * @param optionId
   * @param path
   * @param value
   */
  handleUpdateQuestionsOption(questionId, optionId, path, value) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.map(question => {
          if (question.id === questionId) {
            question.options.map(option => {
              if (option.id === optionId) {
                option[path] = value;
              }
            })
          }
          return question;
        })
      }
    });
  }

  /**
   * This function is called when the Quiz's Question's Correct Answer is updated.
   * <<currentQuiz>> key from the State is updated.
   * @param questionId
   * @param selectedOption
   */
  handleUpdateQuestionsAnswer(questionId, selectedOption) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.map(question => {
          if (question.id === questionId) {
            question.correctAnswer = selectedOption;
          }
          return question;
        })
      }
    });
  }

  /**
   * This function removes one Quiz's Question from the State.
   * @param questionId
   */
  handleRemoveQuestion(questionId) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.filter(question => question.id !== questionId)
      }
    });
  }

  /**
   * This function removes one Quiz's Question's Option from the State.
   * @param questionId
   * @param optionId
   */
  handleRemoveQuestionsOption(questionId, optionId) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.map(question => {
          if (question.id === questionId) {
            question.options = question.options.filter(option => option.id !== optionId)
          }
          return question;
        })
      }
    });
  }

  /**
   * Returns the Quiz's Question.
   * @returns {Array}
   */
  renderQuestions() {
    let state = this.state;
    return state.currentQuiz.questions.map((question, index) => {
      return (
        <Question
          addNewOption={questionId => this.addNewOption(questionId)}
          currentQuestion={question}
          disabled={!!state.currentQuiz.assignees.length}
          id={question.id}
          index={index + 1}
          key={question.id}
          removeQuestion={qId => this.handleRemoveQuestion(qId)}
          removeQuestionsOption={(qId, optId) => this.handleRemoveQuestionsOption(qId, optId)}
          updateQuestion={(qId, path, value) => this.handleUpdateQuestion(qId, path, value)}
          updateQuestionsOption={(qId, optId, path, value) => this.handleUpdateQuestionsOption(qId, optId, path, value)}
          updateQuestionsAnswer={(qId, selectedOption) => this.handleUpdateQuestionsAnswer(qId, selectedOption)}
        />
      );
    });
  }

  /**
   * This function pushes a new Empty Question related to the current Quiz on the State.
   */
  addNewQuestion() {
    let state = this.state;
    this.setState({
      currentQuiz: {
        ...state.currentQuiz,
        questions: [
          ...state.currentQuiz.questions,
          {
            id: state.currentQuiz.questions.length + 1,
            title: "",
            options: [{id: 1, title: ""}],
            correctAnswer: []
          }
        ]
      }
    })
  }

  /**
   * This function pushes a new Empty Option related to the Quiz's Question on the State.
   * @param questionId
   */
  addNewOption(questionId) {
    let currentQuiz = this.state.currentQuiz;
    this.setState({
      currentQuiz: {
        ...currentQuiz,
        questions: currentQuiz.questions.map(question => {
          if (question.id === questionId) {
            question.options = [
              ...question.options,
              {
                id: question.options.length + 1,
                title: ""
              }
            ];
          }
          return question;
        })
      }
    });
  }

  /**
   * Create new Quiz or Update existing Quiz.
   */
  submitQuiz() {
    let props = this.props;
    if (props.currentQuiz.newEntry) {
      // Remove the <<newEntry>> key.
      delete this.state.currentQuiz.newEntry;
      props.createQuiz(this.state.currentQuiz);
    } else {
      props.updateQuiz(this.state.currentQuiz);
    }
  }

  /**
   * Remove Quiz.
   */
  removeQuiz() {
    this.props.removeQuiz(this.state.currentQuiz.id);
  }

  /**
   * Return Quiz's controls. If the Quiz is assigned at least to one Student, those will be disabled.
   * @returns {XML}
   */
  renderControls() {
    let disabled = !!this.state.currentQuiz.assignees.length;
    return (
      <div className="row quiz-controls-section">
        <button
          disabled={disabled}
          className="btn btn-default quiz-control"
          onClick={() => this.submitQuiz()}>Submit</button>
        {!this.props.currentQuiz.newEntry ?
          <button
            disabled={disabled}
            className="btn btn-default remove-control"
            onClick={() => this.removeQuiz()}>Remove Quiz</button> :
          <div/>
        }
      </div>
    );
  }

  render() {
    let state = this.state;
    let disabled = !!state.currentQuiz.assignees.length;

    return (
      <div>
        <button className="btn btn-default goback-control" onClick={() => this.props.goToQuizzesList()}>Go back</button>
        <br/>
        <h4>Quiz's Title</h4>
        <CommonInput
          disabled={disabled}
          value={state.currentQuiz.title}
          onChange={e => this.onChange('title', e.target.value)}
          placeholder={'Quiz\'s title'}/>
        <br/>
        <h4>Questions</h4>
        {!disabled ?
          <div className="pointer" onClick={() => this.addNewQuestion()}> + Add new question</div> :
          <div/>
        }
        <hr/>
        {this.renderQuestions()}
        {this.renderControls()}
      </div>
    )
  }
}

QuizForm.propTypes = {
  // Function for creating a new instance of Quiz.
  createQuiz: PropTypes.func.isRequired,
  // Current Teacher's Quiz.
  currentQuiz: PropTypes.object.isRequired,
  // Function for Going Back to the Quizzes list.
  goToQuizzesList: PropTypes.func.isRequired,
  // Function for removing the current Teacher's quiz.
  removeQuiz: PropTypes.func.isRequired,
  // Function for updating the current Teacher's quiz.
  updateQuiz: PropTypes.func.isRequired
};
