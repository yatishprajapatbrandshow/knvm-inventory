import { jwtDecode } from "jwt-decode";

export const isSessionActive = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false; // No token, session is not active
  }
  
  try {
    const decodedToken = jwtDecode(token);
    // const currentTime = Date.now() / 1000;
    const currentTime = Math.floor(Date.now() / 1000);
     
    // const differenceInMinutes = Math.floor((decodedToken.exp - currentTime) / 60);

    // console.log('Difference in minutes:', differenceInMinutes);
    if (decodedToken.exp < currentTime) {
      // Token has expired; log the user out
      logoutUser();
   
      return false; // Token is expired, session is not active
    }

    return true; // Token exists and is not expired, session is active
  } catch (error) {
    // Handle token decoding errors
    console.error('Token decoding error:', error);
    return false; // Session is not active
  }
};

function logoutUser() {
  // Add your logout logic here, e.g., clear local storage, user data, and navigate to the login page
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  // Redirect to the login page using React Router's navigate or Link
  // Example: navigate('/login');
}

// console.log(isSessionActive() + "line 42");
// const token = localStorage.getItem('token');
// localStorage.removeItem('token');
// console.log('Token:', token);

// Check if 'user' exists in localStorage
// const user = localStorage.getItem('user');

// console.log('User:', user);


