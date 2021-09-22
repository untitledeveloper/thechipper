function getid(x) {
  return document.getElementById(x)
}

console.log("SignUp Page")

const signupFormHandler = async (event) => {
  // Stop the browser from submitting the form so we can do so with JavaScript
  event.preventDefault();

  // Gather the data from the form elements on the page
  const firstname = getid("firstname").value.trim();
  const lastname = getid("lastname").value.trim();
  const email = getid("email").value.trim();
  const password = getid("password").value.trim();

  if (email) {
    // Send the e-mail to the server for validate for unique
    const response = await fetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    console.log(firstname, lastname, email, password)

    if (response.ok) {
      document.location.replace("/");
      alert("Sigup successful");
    } else {
      if (response.status == 409) {
        const { message } = await response.json();

        // display the error message
        document.querySelector(".signup-error-message").innerText = message;
      } else {
        // display the error message
        document.querySelector(".signup-error-message").innerText =
          "Unexpected error! Please try again later.";
      }
    }
  }
};

document
  .querySelector(".signupForm")
  .addEventListener("submit", signupFormHandler);
