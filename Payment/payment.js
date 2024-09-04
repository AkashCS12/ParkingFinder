
function runTimeoutScript(locationName, slotNumber) {
    $.ajax({
      url: 'timeout.php',
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

  setInterval(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const locationName = urlParams.get('location').toLowerCase().replace(/ /g, '_');
    const slotNumber = urlParams.get('slot');
    runTimeoutScript(locationName, slotNumber);
  }, 2000);

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
  function formatCardNumber() {
    let cardInput = document.getElementById('card-number');
    let cardNumber = cardInput.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    cardInput.value = cardNumber;
    let cardBrand = getCardBrand(cardNumber);
    displayCardBrandIcon(cardBrand);
    validateCardNumber();
  }

  function getCardBrand(cardNumber) {
      const cardNumberWithoutSpaces = cardNumber.replace(/\s/g, '');
      const cardBrands = [
          { name: 'visa', regex: /^4[0-9]{12}(?:[0-9]{3})?$/ },
          { name: 'mastercard', regex: /^5[1-5][0-9]{14}$/ },
          { name: 'amex', regex: /^3[47][0-9]{13}$/ },
          { name: 'discover', regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/ }
      ];
  
      for (const brand of cardBrands) {
          if (brand.regex.test(cardNumberWithoutSpaces)) {
              return brand.name;
          }
      }
  
      return 'card';
  }
  
  
  function displayCardBrandIcon(brand) {
      let iconElement = document.getElementById('card-brand-icon');
      let iconSrc = `../Resources/${brand}.png`;
      console.log("Icon Source:", iconSrc);
      iconElement.src = iconSrc;
  }
   
  
  function validateCardNumber() {
      let cardInput = document.getElementById('card-number');
      let cardNumber = cardInput.value.replace(/\s/g, '');
      let cardBrand = getCardBrand(cardNumber);
      if (cardBrand !== 'card') {
        document.getElementById('card-errors').textContent = '';
        return;
      }
      
      let isValid = /^\d{16}$/.test(cardNumber);
      if (!isValid) {
        document.getElementById('card-errors').textContent = 'Invalid card number';
      } else {
        document.getElementById('card-errors').textContent = '';
      }
    }

function formatExpirationDate() {
  let expirationDateInput = document.getElementById('expiration-date');
  let expirationDate = expirationDateInput.value;

  expirationDate = expirationDate.replace(/\D/g, '');

  if (expirationDate.length > 2) {
    expirationDate = expirationDate.slice(0, 2) + '/' + expirationDate.slice(2);
  }

  expirationDateInput.value = expirationDate.slice(0, 7);
}

function validateExpirationDate() {
  let expirationDateInput = document.getElementById('expiration-date');
  let expirationDateStr = expirationDateInput.value;
  let [month, year] = expirationDateStr.split('/');
  let today = new Date();
  let expirationDate = new Date(parseInt(year), parseInt(month) - 1, 1);

  if (expirationDate < today) {
    const expirationDateErrors = document.getElementById('expiration-date-errors');
    expirationDateErrors.textContent = 'The card is expired.';
    expirationDateErrors.style.color = '#ff0000'; // Set text color to red
} else {
    document.getElementById('expiration-date-errors').textContent = '';
}
}

function payNow() {
  const cardNumber = document.getElementById('card-number').value.trim();
  const expirationDate = document.getElementById('expiration-date').value.trim();
  const cvc = document.getElementById('cvc').value.trim();

  if (!cardNumber || !expirationDate || !cvc) {
      document.getElementById('errors').textContent = 'Please fill out all fields.';
      document.getElementById('errors').style.color = '#ff0000';
      return;
  } else {
      document.getElementById('card-errors').textContent = '';
  }

  if (!isAtLeastOneTimeoutBoxFilled()) {
      document.getElementById('errors').textContent = 'Please enter the Booking Time.';
      return;
  } else {
      document.getElementById('errors').textContent = '';
  }

  showProcessingPopup();

  const urlParams = new URLSearchParams(window.location.search);
  const locationName = urlParams.get('location').toLowerCase().replace(/ /g, '_');
  const slotNumber = urlParams.get('slot');

  const timeoutDays = document.getElementById('timeout-days').value || '0';
  const timeoutHours = document.getElementById('timeout-hours').value || '0';
  const timeoutMinutes = document.getElementById('timeout-minutes').value || '0';
  const timeoutSeconds = document.getElementById('timeout-seconds').value || '0';

  const timeout = {
      days: timeoutDays,
      hours: timeoutHours,
      minutes: timeoutMinutes,
      seconds: timeoutSeconds
  };

  $.ajax({
      url: 'book.php',
      type: 'POST',
      data: {
          location: locationName,
          slot: slotNumber,
          timeout: JSON.stringify(timeout)
      },
      success: function(response) {
          console.log("Book.php response:", response);

          $.ajax({
              url: 'confirmation.php',
              type: 'POST',
              data: {
                  location: locationName,
                  slot: slotNumber
              },
              success: function(confirmationResponse) {
                  console.log("Confirmation.php response:", confirmationResponse);
                  hideProcessingPopup();
                  showSuccessPopup("Payment Successful, Redirecting to Home", "../index.html");
              },
              error: function(xhr, status, error) {
                  console.error("Error in executing confirmation.php:", xhr.responseText);
                  hideProcessingPopup();
              }
          });
      },
      error: function(xhr, status, error) {
          console.error("Error in executing book.php:", xhr.responseText);
          hideProcessingPopup();
      }
  });
}

function showProcessingPopup() {
  const processingPopup = document.createElement('div');
  processingPopup.id = 'processing-popup';
  processingPopup.textContent = 'Processing Payment...';
  processingPopup.style.position = 'fixed';
  processingPopup.style.top = '50%';
  processingPopup.style.left = '50%';
  processingPopup.style.transform = 'translate(-50%, -50%)';
  processingPopup.style.padding = '50px';
  processingPopup.style.backgroundColor = 'rgb(0, 0, 0)';
  processingPopup.style.color = '#fff';
  processingPopup.style.borderRadius = '25px';
  processingPopup.style.zIndex = '9999';
  processingPopup.style.fontWeight = 'bold';

  document.body.appendChild(processingPopup);
}

function hideProcessingPopup() {
  const processingPopup = document.getElementById('processing-popup');
  if (processingPopup) {
      processingPopup.remove();
  }
}

function calculateTotalCost() {
const days = parseInt(document.getElementById('timeout-days').value) || 0;
const hours = parseInt(document.getElementById('timeout-hours').value) || 0;
const minutes = parseInt(document.getElementById('timeout-minutes').value) || 0;
const seconds = parseInt(document.getElementById('timeout-seconds').value) || 0;

const totalTimeInSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
let totalCost = 0;
if (totalTimeInSeconds <= 24 * 60 * 60) {
    totalCost = 10;
} else {
    const extraDays = Math.ceil((totalTimeInSeconds - 24 * 60 * 60) / (24 * 60 * 60));
    totalCost = 10 + extraDays * 10;
}

document.getElementById('cost-display').innerText = `Total Cost: ₹${totalCost}`;
}


function showSuccessPopup(message, redirectUrl) {
const popupElement = $('<div>').css({
  'position': 'fixed',
  'top': '50%',
  'left': '50%',
  'transform': 'translate(-50%, -50%)',
  'padding': '50px',
  'background-color': 'rgb(0, 0, 0)',
  'color': '#fff',
  'box-shadow': '0 0 10px rgba(0, 0, 0, 0.5)',
  'z-index': '1000',
  'font-weight': 'bold',
  'border-radius': '25px'
}).text(message);

$('body').append(popupElement);

setTimeout(function() {
  window.location.href = redirectUrl;
}, 3000);
}

document.getElementById('timeout-days').addEventListener('input', updateTotalCost);
document.getElementById('timeout-hours').addEventListener('input', updateTotalCost);
document.getElementById('timeout-minutes').addEventListener('input', updateTotalCost);
document.getElementById('timeout-seconds').addEventListener('input', updateTotalCost);

function updateTotalCost() {
  const days = parseInt(document.getElementById('timeout-days').value) || 0;
  const hours = parseInt(document.getElementById('timeout-hours').value) || 0;
  const minutes = parseInt(document.getElementById('timeout-minutes').value) || 0;
  const seconds = parseInt(document.getElementById('timeout-seconds').value) || 0;

  const totalTimeInSeconds = days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  let totalCost = 0;

  if (totalTimeInSeconds <= 24 * 60 * 60) {
      totalCost = 10;
  } else {
      const extraDays = Math.ceil((totalTimeInSeconds - 24 * 60 * 60) / (24 * 60 * 60));
      totalCost = 10 + extraDays * 10;
  }

  document.getElementById('cost-display').textContent = `Total Cost: Rs. ${totalCost}`;
}

function isAtLeastOneTimeoutBoxFilled() {
  const days = document.getElementById('timeout-days').value.trim();
  const hours = document.getElementById('timeout-hours').value.trim();
  const minutes = document.getElementById('timeout-minutes').value.trim();
  const seconds = document.getElementById('timeout-seconds').value.trim();

  return days !== '' || hours !== '' || minutes !== '' || seconds !== '';
}

function isNumber(event) {
const charCode = (event.which) ? event.which : event.keyCode;
if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
}
return true;
}
