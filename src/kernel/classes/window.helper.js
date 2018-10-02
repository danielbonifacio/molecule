const $ = require('jquery');
const { remote } = require('electron');

const WindowFrame = {
  close() {
    CurrentWindow.close();
  },
  toggle() {
    if (CurrentWindow.isMaximized()) {
      CurrentWindow.unmaximize();
      $('#toggle-maximize').removeClass('maximized');
    } else {
      CurrentWindow.maximize();
      $('#toggle-maximize').addClass('maximized');
    }
  },
  minimize() {
    CurrentWindow.minimize();
  }
}

const CurrentWindow = remote.getCurrentWindow();

window.addEventListener('blur', function () {
  $('#window-frame').addClass('blur');
  $('#lateral-menu').addClass('blur');
});

window.addEventListener('focus', function () {
  $('#window-frame').removeClass('blur');
  $('#lateral-menu').removeClass('blur');
});

$(document).on('click', '#close', WindowFrame.close);
$(document).on('click', '#toggle-maximize', WindowFrame.toggle);
$(document).on('click', '#minimize', WindowFrame.minimize);