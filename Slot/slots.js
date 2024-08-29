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

function redirectToContact() {
  window.location.href = "../ContactUs/contact.html";
}

function redirectToFAQ() {
  window.location.href = "../FAQ/faq.html";
}

function runTimeoutScript(locationName, slotNumber) {
  $.ajax({
    url: '../Payment/timeout.php',
    type: 'POST',
    data: {
      location: locationName,
      slot: slotNumber
    },
    success: function(response) {
      console.log('Timeout script executed successfully');
    },
    error: function(xhr, status, error) {
      console.error(xhr.responseText);
    }
  });
}

function runSensorCheck() {
  $.ajax({
    url: 'status/sensorCheck.php',
    type: 'GET',
    success: function(response) {
      console.log('Sensor Check executed successfully');
    },
    error: function(xhr, status, error) {
      console.error(xhr.responseText);
    }
  });
}

setInterval(runSensorCheck, 5000);


setInterval(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const locationName = urlParams.get('location').toLowerCase().replace(/ /g, '_');
  const slotNumber = urlParams.get('slot');
  runTimeoutScript(locationName, slotNumber);
}, 5000);

document.addEventListener('DOMContentLoaded', function () {
  const updateStatusButton = document.getElementById('updateStatusButton');
  if (updateStatusButton) {
      updateStatusButton.addEventListener('click', function () {
          const urlParams = new URLSearchParams(window.location.search);
          const locationName = urlParams.get('location');
          const slotNumber = urlParams.get('slot');

          runTimeoutScript(locationName, slotNumber);
      });
  }
});

function getCookie(name) {
  var cookieArr = document.cookie.split(';');
  for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');
      if (name == cookiePair[0].trim()) {
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
  window.location.href = "../Account/account.html";
}

function updateStatus(locationName) {
  fetch(`info.php?location=${encodeURIComponent(locationName)}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          if (data.error) {
              throw new Error(data.error);
          }
          displayParkingSlots(data.slots);
      })
      .catch(error => {
          console.error('Error updating status:', error.message);
      });
}

let currentLocation;

function fetchParkingSlots(locationName) {
    currentLocation = locationName;
    fetch(`info.php?location=${encodeURIComponent(locationName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            document.getElementById('location-heading').textContent = data.location;
            displayParkingSlots(data.slots);
            setInterval(() => updateStatus(locationName), 5000);
        })
        .catch(error => {
            console.error('Error fetching parking slot information:', error.message);
            document.getElementById('location-heading').textContent = "Error Fetching Data";
        });
}

function displayParkingSlots(slots) {
  const parkingContainer = document.getElementById('parking-container');
  parkingContainer.innerHTML = '';

  slots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.classList.add('parking-slot');
      let statusColor;
      if (slot.status === 'occupied') {
          statusColor = 'red';
      } else if (slot.status === 'unoccupied') {
          statusColor = 'green';
      } else if (slot.status === 'Booked') {
          statusColor = 'orange';
      } else if (slot.status === 'No Sensor Data') {
          statusColor = 'yellow';
      }
      slotDiv.innerHTML = `
          <h1>Parking Slot ${slot.id}</h1>
          <h3>Status: <span style="color: ${statusColor};">${slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}</span></h3><br>
      `;
      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      const image = document.createElement('img');
      if (slot.status === 'unoccupied') {
          image.src = '../Resources/image1.jpg';
      } else if (slot.status === 'occupied') {
          image.src = '../Resources/image2.jpg';
      } else if (slot.status === 'No Sensor Data') {
          image.src = '../Resources/image3.jpg';
      } else if (slot.status === 'Booked') {
          image.src = '../Resources/image4.jpg';
      }
      imageContainer.appendChild(image);
      slotDiv.appendChild(imageContainer);

      if (slot.status !== 'No Sensor Data') {
          if (slot.status !== 'Booked') {
              const bookButton = document.createElement('button');
              bookButton.textContent = 'Book Slot';
              bookButton.className = 'book-button';
              bookButton.onclick = function () {
                var loggedIn = getCookie("loggedIn");
                if (loggedIn === "true") {
                    var location = currentLocation;
                    checkUserBooking(slot, location);
                } else {
                    displaySignInModal();
                }
            };          
              slotDiv.appendChild(bookButton);
          }

          const newLine = document.createElement('br');
          slotDiv.appendChild(newLine);

          const updateStatusButton = document.createElement('button');
          updateStatusButton.textContent = 'Update Status';
          updateStatusButton.className = 'update-status-button';
          updateStatusButton.onclick = function () {
              const location = currentLocation;
              const slotNumber = slot.id;
              runTimeoutScript(location, slotNumber);
          };
          slotDiv.appendChild(updateStatusButton);
      }

      parkingContainer.appendChild(slotDiv);
  });
}

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const locationName = urlParams.get('location');

  if (locationName) {
      fetchParkingSlots(locationName);
  } else {
      document.getElementById('location-heading').textContent = "Location Not Found";
  }
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
};

function displaySignInModal() {
  $('#signInModal').modal('show');
}

function signIn() {
  var usernameOrEmail = document.getElementById("usernameOrEmail").value;
  var password = document.getElementById("password").value;
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "../SignIn/data.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (xhr.responseText === "success") {
                  setCookie("loggedIn", "true");
                  window.location.reload();
              } else {
                  document.getElementById("signInError").textContent = "Invalid username/email or password.";
              }
          }
      }
  };
  xhr.send("usernameOrEmail=" + usernameOrEmail + "&password=" + password);
}


function getCookie(name) {
  var cookieArr = document.cookie.split(';');
  for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');
      if (name == cookiePair[0].trim()) {
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
  xhr.open("GET", "../SignIn/data.php?checkEmail=true&email=" + encodeURIComponent(email), true);
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
  xhr.open("GET", "../SignIn/data.php?sendOTP=true&email=" + encodeURIComponent(email), true);
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
    xhr.open("GET", "../SignIn/data.php?validateOTP=true&enteredOTP=" + encodeURIComponent(otp), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText.trim() === "valid") {
          var newPasswordValue = encodeURIComponent(newPassword);
          var xhrUpdatePassword = new XMLHttpRequest();
          xhrUpdatePassword.open("GET", "../SignIn/data.php?updatePassword=true&newPassword=" + newPasswordValue, true);
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

function checkUserBooking(slot, location) {
  $.ajax({
      url: 'usercheck.php',
      type: 'GET',
      dataType: 'json',
      success: function(response) {
          if (response.error) {
              console.error(response.error);
              return;
          }
          if (response.hasBooking) {
              var bookingPopUp = document.getElementById('BookingPopUp');
              bookingPopUp.style.display = 'block';

              var okButton = document.getElementById('okButton');
              okButton.onclick = function() {
                  bookingPopUp.style.display = 'none';
              };
          } else {
              window.location.href = '../Payment/payment.html?slot=' + slot.id + '&location=' + encodeURIComponent(location);
          }
      },
      error: function(xhr, status, error) {
          console.error(xhr.responseText);
      }
  });

  return false;
}
