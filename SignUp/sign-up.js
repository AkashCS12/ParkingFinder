function redirectToHome() {
    window.location.href = "../index.html";
  }
  function redirectToAbout() {
    window.location.href = "../AboutUs/about.html";
  }

  function submitForm() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;

    var usernameError = document.getElementById("username-error");
    var emailError = document.getElementById("email-error");
    var phoneError = document.getElementById("phone-error");
    var passwordError = document.getElementById("password-error");

    usernameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";

    if (username.trim() === "") {
        usernameError.textContent = "Please fill this field";
        usernameError.style.display = "block";
        usernameError.style.color = "red";
        return;
    }
    if (email.trim() === "") {
        emailError.textContent = "Please fill this field";
        emailError.style.display = "block";
        emailError.style.color = "red";
        return;
    } else if (!isValidEmail(email)) {
        emailError.textContent = "Invalid email format";
        emailError.style.display = "block";
        emailError.style.color = "red";
        return;
    }
    if (phone.trim() === "") {
        phoneError.textContent = "Please fill this field";
        phoneError.style.display = "block";
        phoneError.style.color = "red";
        return;
    }
    if (password.trim() === "") {
        passwordError.textContent = "Please fill this field";
        passwordError.style.display = "block";
        passwordError.style.color = "red";
        return;
    }

    document.getElementById("loadingModal").style.display = "block";
    document.getElementById("submitBtn").disabled = true;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "signup.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = xhr.responseText.trim();
            if (response === "success") {
                showPopup();
                countdownRedirect(3);
            } else if (response === "email_exists") {
                emailError.textContent = "Email already taken";
                emailError.style.display = "block";
                emailError.style.color = "red";
            } else if (response === "username_exists") {
                usernameError.textContent = "Username already taken";
                usernameError.style.display = "block";
                usernameError.style.color = "red";
            } else {
                alert("Signup failed. Please try again.");
            }
            document.getElementById("loadingModal").style.display = "none";
            document.getElementById("submitBtn").disabled = false;
        }
    };
    xhr.send("username=" + encodeURIComponent(username) + "&email=" + encodeURIComponent(email) + "&phone=" + encodeURIComponent(phone) + "&password=" + encodeURIComponent(password));
}

function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

  function showPopup() {
    document.getElementById("popupContainer").style.display = "block";
  }

  function countdownRedirect(seconds) {
    var countdownElement = document.getElementById("countdown");
    countdownElement.textContent = seconds;

    var countdownInterval = setInterval(function() {
      seconds--;
      countdownElement.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(countdownInterval);
        window.location.href = '../index.html';
      }
    }, 1000);
  }

  function redirectToContact() {
    window.location.href = "../ContactUs/contact.html";
  }

  function redirectToFAQ() {
    window.location.href = "../FAQ/faq.html";
  }