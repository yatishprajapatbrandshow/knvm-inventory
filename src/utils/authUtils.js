// authUtils.js
export const setUserData = (data) => {
  // Save the token in local storage
  localStorage.setItem('token', data.token);

  // Store user details in local storage
  const user = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
    phone: data.user.phone,
    type: data.user.userType,
    // Add other user details as needed
  };
  localStorage.setItem('user', JSON.stringify(user));
};

export const navigateBasedOnUserType = (navigate, userType) => {
  if (userType === 'Admin') {
    navigate('/admin-dashboard');
  } else {
    navigate('/dashboard');
  }
};
