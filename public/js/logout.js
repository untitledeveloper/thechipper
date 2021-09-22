const logoutHandler = async (event) => {
  // Stop browser from processing the # or link
  event.preventDefault();
  
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to log out.');
  }
};

document
  .querySelector('.logout-link')
  .addEventListener('click', logoutHandler);