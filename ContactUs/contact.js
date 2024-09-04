function redirectToSignUp() {
    window.location.href = "../SignUp/sign-up.html";
  }
  function redirectToHome() {
    window.location.href = "../index.html";
  }
  function redirectToAbout() {
    window.location.href = "../AboutUs/about.html";
  }
  function redirectToMap() {
    window.location.href = "../LargeMap.html";
  }
  function redirectToFAQ() {
    window.location.href = "../FAQ/faq.html";
  }

  window.onload = function() {
      var loggedIn = getCookie("loggedIn");
      var userContainer = document.querySelector('.user-container');
      var signUpBtn = document.querySelector('.signup-btn');
      if (loggedIn === "true") {
          signUpBtn.style.display = "none";
          userContainer.style.display = "block";
      } else {
          signUpBtn.style.display = "block";
          userContainer.style.display = "none";
      }
  }

  function getCookie(name) {
      var cookieArr = document.cookie.split(';');
      for(var i = 0; i < cookieArr.length; i++) {
          var cookiePair = cookieArr[i].split('=');
          if(name == cookiePair[0].trim()) {
              return decodeURIComponent(cookiePair[1]);
          }
      }
      return null;
  }

  function setCookie(name, value) {
      document.cookie = name + "=" + value + ";path=/";
  }

  function clearCookie(name) {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  }

  function logout() {
      clearCookie("loggedIn");
      window.location.reload();
  }

  function profile() {
      window.location.href="../Account/account.html";
  }

  function showPopup(message, isSuccess) {
    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');
    var popupContent = document.getElementById('popupContent');
  
    var heading = isSuccess ? "Submission Successful" : "Submission Unsuccessful";
    var headingColor = isSuccess ? "#4CAF50" : "#FF0000";

    var description = isSuccess ? "<img src='../Resources/success.png' alt='Success Icon'>" : "<img src='../Resources/unsuccess.png' alt='Red Cross Icon'>";
  
    popupContent.innerHTML = "<h3 style='color: " + headingColor + "'>" + heading + "</h3>" + description;
    
    popup.style.display = 'block';
    overlay.style.display = 'block';
    if (isSuccess) {
      setTimeout(function() {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        window.location.reload();
      }, 3000);
    }
  }

  function showPleaseWaitPopup() {
    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');
    var popupContent = document.getElementById('popupContent');
    
    popupContent.innerHTML = "<div class='popup-content'>Please wait...</div>";
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }

  function closePopup() {
    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    showPleaseWaitPopup();

    var formData = new FormData(this);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../ContactUs/message.php', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var response = xhr.responseText;
        showPopup(response, true);
      } else {
        showPopup('Error: ' + xhr.statusText, false);
      }
    };
    xhr.onerror = function() {
      showPopup('Network Error', false);
    };
    xhr.send(formData);
  });