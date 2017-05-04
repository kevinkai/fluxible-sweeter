import React from 'react';
import UserBar from './UserBar';
import FluxibleMixin from 'fluxible-addons-react/FluxibleMixin';
import sweetAlert from '../../utils/sweetAlert';
import { Link, routerShape } from 'react-router';
import { Button, Glyphicon } from 'react-bootstrap';
import { UserActions } from '../../actions';
import { UserStore } from '../../stores';
import { UserSettingsNav } from '../LeftNavs';

const ChangePassword = React.createClass({

  displayName: 'ChangePassword',

  contextTypes: {
    router: routerShape.isRequired,
    executeAction: React.PropTypes.func,
  },

  propTypes: {
    location: React.PropTypes.object
  },

  mixins: [FluxibleMixin],

  statics: {
    storeListeners: [UserStore]
  },

  getInitialState() {
    return this.getStatesFromStores();
  },

  getStatesFromStores() {
    return {
      currentUser: this.getStore(UserStore).getCurrentUser(),
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      passwordValidate: '',
      confirmPasswordValidate: ''
    };
  },

  onChange(res) {
    if (res.stat) {
      sweetAlert.alertSuccessMessageWithCallback(res.msg, () => {
        this.context.router.push('/login');
      });
    } else {
      this.setState({ oldPasswordMsg: res.msg });
    }
  },

  validatePassword(password) {
    let flag = false;
    if (!password) {
      this.setState({
        passwordMsg: '* Password is required !',
        passwordValidate: 'has-error'
      });
    } else if (password.length < 5) {
      this.setState({
        passwordMsg: '* Password is too short',
        passwordValidate: 'has-error'
      });
    } else {
      this.setState({
        passwordMsg: '',
        passwordValidate: 'has-success'
      });
      flag = true;
    }

    return flag;
  },

  validateOldPassword(password) {
    let flag = false;
    if (!password) {
      this.setState({ oldPasswordMsg: '* Password is required !' });
    } else {
      this.setState({ oldPasswordMsg: '' });
      flag = true;
    }
    return flag;
  },

  validateConfirmPassword(confirmPassword) {
    let flag = false;
    if (!confirmPassword) {
      this.setState({
        confirmPasswordMsg: '* Please enter password again !',
        confirmPasswordValidate: 'has-error'
      });
    } else if (confirmPassword !== this.state.newPassword) {
      this.setState({
        confirmPasswordMsg: '* The password is different',
        confirmPasswordValidate: 'has-error'
      });
    } else {
      this.setState({
        confirmPasswordMsg: '',
        confirmPasswordValidate: 'has-success'
      });
      flag = true;
    }
    return flag;
  },

  handleOldPassword(e) {
    this.validateOldPassword(e.target.value);
    this.setState({ oldPassword: e.target.value });
  },

  handlePassword(e) {
    this.validatePassword(e.target.value);
    this.setState({ newPassword: e.target.value });
  },

  handleConfirmPassword(e) {
    this.validateConfirmPassword(e.target.value);
    this.setState({ confirmNewPassword: e.target.value });
  },

  onSubmitChangePassword(e) {
    e.preventDefault();
    const {
      currentUser,
      oldPassword,
      newPassword,
      confirmNewPassword
    } = this.state;

    const isOldPassword = this.validateOldPassword(oldPassword);
    const isNewPassword = this.validatePassword(newPassword);
    const isConfirmNewPassword = this.validateConfirmPassword(confirmNewPassword);

    if (isOldPassword && isNewPassword && isConfirmNewPassword) {
      const newPasswordObj = {
        userId: currentUser._id,
        oldPassword,
        newPassword
      };
      this.executeAction(UserActions.ChangeUserPassword, newPasswordObj);
    } else {
      sweetAlert.alertErrorMessage('Update password failed !');
    }
  },

  render() {
    const { pathname } = this.props.location;
    const { currentUser, oldPassword, newPassword, confirmNewPassword } = this.state;
    return (
      <div className="user-settings">
        <UserBar path={pathname} user={currentUser} isCurrentUser={true} currentUser={currentUser} />
        <div className="settings-content">
          <div className="settings-left">
            <UserSettingsNav path={pathname} />
          </div>
          <div className="settings-right">
            <div className="well personal-info">
              <h2>Change Password</h2>
              <div className="form-horizontal change-password">
                <div className="form-group">
                  <label className="col-sm-3 control-label">Old Password</label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={this.handleOldPassword}
                    />
                    <p className="help-block"> {this.state.oldPasswordMsg}</p>
                  </div>
                </div>
                <div className={`form-group ${this.state.passwordValidate}`}>
                  <label className="col-sm-3 control-label">New Password</label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={this.handlePassword}
                    />
                    <p className="help-block"> {this.state.passwordMsg}</p>
                  </div>
                </div>
                <div className={`form-group ${this.state.confirmPasswordValidate}`}>
                  <label className="col-sm-3 control-label">Confirm Password</label>
                  <div className="col-sm-6">
                    <input
                      type="password"
                      className="form-control"
                      value={confirmNewPassword}
                      onChange={this.handleConfirmPassword}
                    />
                    <p className="help-block"> {this.state.confirmPasswordMsg}</p>
                  </div>
                </div>
                <div className="form-group options">
                  <label className="col-sm-3 control-label"></label>
                  <div className="col-sm-6">
                    <Button className="btn btn-primary" onClick={this.onSubmitChangePassword}>
                      Confirm change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

export default ChangePassword;
