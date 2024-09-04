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
  function redirectToContact() {
    window.location.href="../ContactUs/contact.html";
}