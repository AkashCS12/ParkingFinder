function login() {
  var usernameOrEmail = document.getElementById("usernameOrEmail").value;
  var password = document.getElementById("password").value;
  var errorMsg = document.getElementById("error-msg");
  var loginBtn = document.querySelector(".login-btn");

  loginBtn.disabled = true;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "data.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText.trim() === "success") {
              errorMsg.textContent = "";
              showPopup();
          } else {
              errorMsg.textContent = "Invalid email or password";
              loginBtn.disabled = false;
          }
      }
  };
  xhr.send("usernameOrEmail=" + encodeURIComponent(usernameOrEmail) + "&password=" + encodeURIComponent(password));
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
      login();
  }
}

document.getElementById("usernameOrEmail").addEventListener("keypress", handleKeyPress);
document.getElementById("password").addEventListener("keypress", handleKeyPress);

function showPopup() {
  var popupContainer = document.getElementById("popupContainer");
  popupContainer.style.display = "block";

  var countdown = document.getElementById("countdown");
  var seconds = 3;
  countdown.textContent = seconds + " seconds";

  var timer = setInterval(function() {
      seconds--;
      countdown.textContent = seconds + " seconds";
      if (seconds <= 0) {
          clearInterval(timer);
          window.location.href = "../index.html";
      }
  }, 1000);
}

function redirectToHome() {
  window.location.href = "../index.html";
}

function redirectToAbout() {
  window.location.href = "../AboutUs/about.html";
}

function redirectToContact() {
  window.location.href = "../ContactUs/contact.html";
}

function redirectToFAQ() {
  window.location.href = "../FAQ/faq.html";
}

function showForgotPasswordPopup() {
  document.getElementById("forgotPasswordPopup").style.display = "block";
}

function sendOTP() {
  var email = document.getElementById("forgotPasswordEmail").value;
  var emailError = document.getElementById("email-error");
  var otpSection = document.getElementById("otp-section");
  var submitBtn = document.getElementById("submit-btn");
  var sendOTPBtn = document.getElementById("send-otp-btn");

  emailError.textContent = "";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "data.php?checkEmail=true&email=" + encodeURIComponent(email), true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText.trim() === "found") {
              sendOTPByEmail(email);
              sendOTPBtn.disabled = true;
              var timerSeconds = 15;
              var timerInterval = setInterval(function() {
                  timerSeconds--;
                  sendOTPBtn.textContent = "Send OTP";
                  if (timerSeconds <= 0) {
                      clearInterval(timerInterval);
                      sendOTPBtn.textContent = "Resend OTP";
                      sendOTPBtn.disabled = false;
                  }
              }, 1000);
          } else {
              emailError.textContent = "Email not found";
          }
      }
  };
  xhr.send();
}


function sendOTPByEmail(email) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "data.php?sendOTP=true&email=" + encodeURIComponent(email), true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          if (xhr.responseText.trim() === "error") {
              console.log("Error sending OTP");
          } else {
              var otpSection = document.getElementById("otp-section");
              var submitBtn = document.getElementById("submit-btn");
              otpSection.style.display = "block";
              submitBtn.style.display = "block";
          }
      }
  };
  xhr.send();
}


function submitNewPassword() {
  var otp = document.getElementById("otp").value;
  var newPassword = document.getElementById("newPassword").value;
  var otpError = document.getElementById("otp-error");
  var newPasswordError = document.getElementById("new-password-error");

  otpError.textContent = "";
  newPasswordError.textContent = "";

  if (otp !== "") {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "data.php?validateOTP=true&enteredOTP=" + encodeURIComponent(otp), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText.trim() === "valid") {
          var newPasswordValue = encodeURIComponent(newPassword);
          var xhrUpdatePassword = new XMLHttpRequest();
          xhrUpdatePassword.open("GET", "data.php?updatePassword=true&newPassword=" + newPasswordValue, true);
          xhrUpdatePassword.onreadystatechange = function() {
            if (xhrUpdatePassword.readyState === 4 && xhrUpdatePassword.status === 200) {
              var successPopup = document.getElementById("successPopup");
              successPopup.style.display = "block";
              setTimeout(function() {
                successPopup.style.display = "none";
              }, 2000);
              closeForgotPasswordPopup();
            }
          };
          xhrUpdatePassword.send();
        } else {
          otpError.textContent = "Invalid OTP";
        }
      }
    };
    xhr.send();
  } else {
    otpError.textContent = "Please enter OTP";
  }
}

function closeForgotPasswordPopup() {
  var forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
  forgotPasswordPopup.style.display = "none";
}
