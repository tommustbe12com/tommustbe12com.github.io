// popup.js
// merged with popup-dark.js so this has both

(function () {
  // Styles
  var style = document.createElement('style');
  style.textContent = `
      .popup-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: none;
          border-radius: 2px;
      }

      .popup-content {
          text-align: center;
          color: black;
      }

      .popup-container button {
          padding: 10px;
          background: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
      }
  `;
  document.head.appendChild(style);

  window.Popup = function (options) {
     
      var settings = {
          title: '',
          content: '',
          closeButton: true,
          customClass: '',
      };

      if (options) {
          for (var key in options) {
              if (options.hasOwnProperty(key)) {
                  settings[key] = options[key];
              }
          }
      }

      var popupContainer = document.createElement('div');
      popupContainer.className = 'popup-container ' + settings.customClass;

      var popupContent = document.createElement('div');
      popupContent.className = 'popup-content';

      var popupTitle = document.createElement('h2');
      popupTitle.innerHTML = settings.title;
      popupContent.appendChild(popupTitle);

      var popupBody = document.createElement('div');
      popupBody.innerHTML = settings.content;
      popupContent.appendChild(popupBody);

      if (settings.closeButton) {
          var goodLookBr = document.createElement('br');
          var closeButton = document.createElement('button');
          closeButton.innerHTML = 'Close';
          closeButton.addEventListener('click', function () {
              document.body.removeChild(popupContainer);
          });
          popupContent.appendChild(goodLookBr);
          popupContent.appendChild(closeButton);
      }

      popupContainer.appendChild(popupContent);

      document.body.appendChild(popupContainer);

      popupContainer.style.display = 'block';
  };
})();

(function() {

var style2 = document.createElement('style');
style2.textContent = `
      .popup-container2 {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #111111;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: none;
          border-radius: 2px;
      }

      .popup-content2 {
          text-align: center;
          color: white;
      }

      .popup-container2 button {
          padding: 10px;
          background: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
      }
  `;
document.head.appendChild(style2);

window.PopupDark = function(options) {

  var settings = {
    title: '',
    content: '',
    closeButton: true,
    customClass: '',
  };

  if (options) {
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        settings[key] = options[key];
      }
    }
  }

  var popupContainer = document.createElement('div');
  popupContainer.className = 'popup-container2 ' + settings.customClass;

  var popupContent = document.createElement('div');
  popupContent.className = 'popup-content2';

  var popupTitle = document.createElement('h2');
  popupTitle.innerHTML = settings.title;
  popupContent.appendChild(popupTitle);

  var popupBody = document.createElement('div');
  popupBody.innerHTML = settings.content;
  popupContent.appendChild(popupBody);

  if (settings.closeButton) {
    var goodLookBr = document.createElement('br');
    var closeButton = document.createElement('button');
    closeButton.innerHTML = 'Close';
    closeButton.addEventListener('click', function() {
      document.body.removeChild(popupContainer);
    });
    popupContent.appendChild(goodLookBr);
    popupContent.appendChild(closeButton);
  }

  popupContainer.appendChild(popupContent);

  document.body.appendChild(popupContainer);

  popupContainer.style.display = 'block';
};
})();