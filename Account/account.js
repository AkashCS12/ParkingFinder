window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var userData = JSON.parse(this.responseText);
            document.getElementById('email').textContent = userData.email;
            document.getElementById('username').textContent = userData.username;
            document.getElementById('phone').textContent = userData.phone;
        }
    };
    xhr.open("GET", "getData.php", true);
    xhr.send();

    function fetchBookings() {
        var bookingsXhr = new XMLHttpRequest();
        bookingsXhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    var bookingsData = JSON.parse(this.responseText);
                    updateBookingsContainer(bookingsData);
                } else {
                    console.error("Failed to fetch bookings: " + this.statusText);
                }
            }
        };
        bookingsXhr.open("GET", "getBookings.php", true);
        bookingsXhr.send();
    }

    fetchBookings();

    setInterval(fetchBookings, 1000);
}

function updateBookingsContainer(bookingsData) {
    var bookingsContainer = document.querySelector('.bookings-info');
    bookingsContainer.innerHTML = '';
    if (bookingsData.length > 0) {
        bookingsData.forEach(function(booking) {
            var bookingElement = document.createElement('div');
            var location = booking.location.replace(/_/g, ' ').toLowerCase().replace(/(^|\s)\S/g, function(firstLetter) {
                return firstLetter.toUpperCase();
            });

            var bookingTime = moment(booking.time);
            var timeout = moment(booking.timeout);

            var timeDiff = moment.duration(timeout.diff(bookingTime));

            var days = timeDiff.days();
            var hours = timeDiff.hours();
            var minutes = timeDiff.minutes();
            var seconds = timeDiff.seconds();

            var timeLeftStr = days + "d " + hours + "h " + minutes + "m " + seconds + "s";

            bookingElement.innerHTML = `
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Slot:</strong> ${booking.slot}</p>
                <p><strong>Current Time:</strong> ${bookingTime.format('YYYY-MM-DD HH:mm:ss')}</p>
                <p><strong>Booking Till:</strong> ${timeout.format('YYYY-MM-DD HH:mm:ss')}</p>
                <p><strong>Time Left:</strong> ${timeLeftStr}</p>
                <button class="delete-booking-button" data-booking-id="${booking.id}">Cancel Booking</button>
            `;
            bookingsContainer.appendChild(bookingElement);

            var deleteButton = bookingElement.querySelector('.delete-booking-button');
            deleteButton.addEventListener('click', function() {
                var bookingId = booking.id;
                showDeleteConfirmation(bookingId);
            });
        });
    } else {
        var noBookingsMessage = document.createElement('p');
        noBookingsMessage.textContent = 'No Bookings';
        noBookingsMessage.style.fontWeight = 'bold';
        noBookingsMessage.style.textAlign = 'center';
        noBookingsMessage.style.marginRight = '30px';
        bookingsContainer.appendChild(noBookingsMessage);
    }
}

function showDeleteConfirmation(bookingId) {
    var popup = document.getElementById('deleteConfirmationPopup');
    popup.style.display = 'block';

    var confirmDeleteButton = document.getElementById('confirmDeleteButton');
    var cancelDeleteButton = document.getElementById('cancelDeleteButton');

    confirmDeleteButton.onclick = function() {
        deleteBooking(bookingId);
        popup.style.display = 'none';
    };

    cancelDeleteButton.onclick = function() {
        popup.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    };
}

function deleteBooking(bookingId) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response.success) {
                    window.location.reload();
                } else {
                    console.error("Failed to delete booking: " + response.error);
                }
            }
        }
    };
    xhr.open("POST", "cancelBooking.php", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("tid=" + encodeURIComponent(bookingId));
}



function clearCookie(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

function logout() {
  clearCookie("loggedIn");
  window.location.href = "../index.html";
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

function changeData(field) {
  var modal = document.getElementById("myPopup");
  var changeHeading = document.getElementById("changeHeading");
  var fieldLabel = document.getElementById("fieldLabel");
  var newField = document.getElementById("newField");
  var password = document.getElementById("password");
  var passwordError = document.getElementById("passwordError");
  var fieldError = document.getElementById("fieldError");

  changeHeading.textContent = "Change " + field.charAt(0).toUpperCase() + field.slice(1);

  fieldLabel.textContent = "New " + field.charAt(0).toUpperCase() + field.slice(1) + ":";
  newField.placeholder = "Enter New " + field.charAt(0).toUpperCase() + field.slice(1);
  password.value = "";
  passwordError.textContent = "";
  fieldError.textContent = "";

  modal.style.display = "block";
}

function closePopup() {
  var modal = document.getElementById("myPopup");
  modal.style.display = "none";
}

function submitChanges() {
  document.getElementById("loadingModal").style.display = "block";

  var field = document.getElementById("fieldLabel").textContent.replace("New ", "").replace(":", "").toLowerCase();
  var newField = document.getElementById("newField").value.trim();
  var password = document.getElementById("password").value.trim();
  var passwordError = document.getElementById("passwordError");
  var fieldError = document.getElementById("fieldError");

  if (newField === "") {
      fieldError.textContent = "Please Input Data";
      fieldError.style.display = "block";
      document.getElementById("loadingModal").style.display = "none";
      return;
  } else {
      fieldError.textContent = "";
  }

  if (password === "") {
      passwordError.textContent = "Password cannot be empty.";
      passwordError.style.display = "block";
      document.getElementById("loadingModal").style.display = "none";
      return;
  } else {
      passwordError.textContent = "";
  }

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
          document.getElementById("loadingModal").style.display = "none";
          if (this.status === 200) {
              var response = JSON.parse(this.responseText);
              if (response.success) {
                  document.getElementById("successPopup").style.display = "block";
                  setTimeout(function() {
                      window.location.href = "../index.html";
                  }, 3000);
              } else {
                  passwordError.textContent = response.error;
                  passwordError.style.display = "block";
              }
          }
      }
  };
  xhr.open("POST", "updateData.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("field=" + field + "&value=" + encodeURIComponent(newField) + "&password=" + encodeURIComponent(password));
}

function closeSuccessPopup() {
  document.getElementById("successPopup").style.display = "none";
  window.location.reload();
}

function deleteAccount() {
  var deleteConfirmationModal = document.getElementById("deleteConfirmationModal");
  deleteConfirmationModal.style.display = "block";

  var deleteAccountButton = document.getElementById("deleteAccountButton");
  var deletePasswordInput = document.getElementById("deletePassword");
  var deletePasswordError = document.getElementById("deletePasswordError");

  deleteAccountButton.onclick = function() {
      var password = deletePasswordInput.value.trim();
      if (password !== "") {
          document.getElementById("loadingModal").style.display = "block";
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (this.readyState === 4) {
                  document.getElementById("loadingModal").style.display = "none";
                  if (this.status === 200) {
                      var response = JSON.parse(this.responseText);
                      if (response.success) {
                          document.getElementById("successDeletePopup").style.display = "block";
                          setTimeout(function() {
                            logout();
                          }, 3000);
                      } else {
                          deletePasswordError.textContent = response.error;
                          deletePasswordError.style.display = "block";
                      }
                  }
              }
          };
          xhr.open("POST", "deleteAccount.php", true);
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhr.send("password=" + encodeURIComponent(password));
      } else {
          deletePasswordError.textContent = "Password cannot be empty.";
          deletePasswordError.style.display = "block";
      }
  }

  var deleteCancelButton = document.getElementById("deleteCancelButton");
  deleteCancelButton.onclick = function() {
      deleteConfirmationModal.style.display = "none";
      deletePasswordError.textContent = "";
      deletePasswordInput.value = "";
  }
}
