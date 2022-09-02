// eslint-disable-next-line max-len
export const getStorage = key => (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : []);

export const setStorage = (key, newContact) => {
  const storage = getStorage(key);
  storage.push(newContact);
  localStorage.setItem(key, JSON.stringify(storage));
};

export const removeStorage = (phoneNumber, key) => {
  const storage = getStorage(key);
  const newStorage = storage.filter(item => item.phone !== phoneNumber);
  localStorage.setItem(key, JSON.stringify(newStorage));
};

