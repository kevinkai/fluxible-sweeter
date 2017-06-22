'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const convertMsg = msg => {
  const strMsg = msg.split('_').join(' ').toLowerCase();
  const firstLetter = strMsg.charAt(0).toUpperCase();
  return `${firstLetter}${strMsg.substr(1)} !`;
};

exports.default = {
  success: (msg, cb) => {
    swal({
      title: convertMsg(msg),
      type: 'success',
      confirmButtonColor: '#00a9da',
      timer: 2000
    }, () => {
      if (cb) {
        cb();
      }
    });
  },

  alertSuccessMessageWithCallback: (msg, callback) => {
    swal({
      title: convertMsg(msg),
      type: 'success',
      confirmButtonColor: '#00a9da',
      timer: 2000
    }, () => {
      callback();
    });
  },

  alertInfoMessage: msg => {
    swal({
      title: 'Info',
      text: convertMsg(msg),
      type: 'info',
      timer: 2000
    });
  },

  alertErrorMessage: msg => {
    swal({
      title: convertMsg(msg),
      type: 'error',
      confirmButtonColor: '#F27474',
      timer: 2000
    });
  },

  alertWarningMessage: msg => {
    swal({
      title: convertMsg(msg),
      type: 'warning',
      confirmButtonColor: '#F8BB86'
    });
  },

  alertConfirmMessage: (msg, callback) => {
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, () => {
      setTimeout(() => {
        callback();
      }, 500);
    });
  }
};
module.exports = exports['default'];