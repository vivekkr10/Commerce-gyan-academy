const forgotStore = new Map();

export const setForgotOTP = (email, otp) => {
  forgotStore.set(email, {
    otp,
    expire: Date.now() + 5 * 60 * 1000,
    verified: false,
  });
};

export const getForgotOTP = (email) => forgotStore.get(email);

export const markVerified = (email) => {
  const data = forgotStore.get(email);
  if (data) {
    data.verified = true;
  }
};

export const deleteForgotOTP = (email) => forgotStore.delete(email);