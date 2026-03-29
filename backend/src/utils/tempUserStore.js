const tempUsers = new Map();

export const setTempUser = (email, data) => {
  tempUsers.set(email, {
    ...data,
    expire: Date.now() + 5 * 60 * 1000, // 5 min
  });
};

export const getTempUser = (email) => tempUsers.get(email);

export const deleteTempUser = (email) => tempUsers.delete(email);