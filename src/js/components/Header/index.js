import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./style.css"

/**
 * This component represents the Header of the current platform.
 * Beside the platform's logo, the current user-name logged in and the Logout button (if logged) are rendered.
 */
export default class Header extends Component {
  render() {
    let props = this.props;
    let currentUser = props.currentUser;
    return (
      <div className="header">
        <div className="row">
          <div className="logo col-lg-2">E-Learning</div>
          <div className="right-items col-lg-2">
            {currentUser.id ?
              <div>
                <span className="user-name">{currentUser.name}</span>
                <span className="nav-item" onClick={() => props.handleLogout()}>&nbsp;&nbsp; Logout</span>
              </div> :
              <div/>
            }
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  // Current user that's logged in.
  currentUser: PropTypes.object.isRequired,
  // Function for triggering log-out action.
  handleLogout: PropTypes.func.isRequired
};
