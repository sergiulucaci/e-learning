import React, {Component} from "react";
import PropTypes from 'prop-types';

/**
 * This component is related to the platform text inputs.
 * Beside default input component, this component has those features:
 *  - has a prettier style;
 *  - is able to render a label next to input (both on the same row);
 *  - is able also to render an icon next to input (both on the same row).
 */
export default class Input extends Component {
  renderLabel () {
    let props = this.props;
    return (
      <div>{props.label}</div>
    )
  }

  renderInput() {
    let props = this.props;
    return (
      <input
        className="form-control"
        disabled={props.disabled}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}/>
    )
  }

  renderLayout(label, input, error) {
    let props = this.props;
    if (props.label) {
      return (
        <div className="row">
          <div className="col-md-1 col-sm-1 col-xs-1">
            <div>
              {label}
            </div>
          </div>
          <div className="col-md-5 col-sm-5 col-xs-5">
            {input}
          </div>
        </div>
      )
    } else if (props.rightItem) {
      return (
        <div className="row">
          <div className="col-md-10 col-sm-10 col-xs-10">
            {input}
          </div>
          <div className="col-md-2 col-sm-2 col-xs-2">
            {props.rightItem}
          </div>
        </div>
      )
    }

    return (
      <div>
        {input}
      </div>
    )
  }

  render() {
    return (
      <div className="InputComponent">
        {this.renderLayout(this.renderLabel(), this.renderInput())}
      </div>
    )
  }
}

Input.propTypes = {
  // Boolean value that is related to the input's changing action (if true, the input can't be changed).
  disabled: PropTypes.bool,
  // The label to be rendered next to input.
  label: PropTypes.string,
  // Function for handling the editing current input's text.
  onChange: PropTypes.func,
  // Input's placeholder.
  placeholder: PropTypes.string,
  // React component (like button, icon, etc.).
  rightItem: PropTypes.object,
  // Input's value.
  value: PropTypes.string,
};
