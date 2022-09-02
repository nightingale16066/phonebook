'use strict';

// eslint-disable-next-line max-len
const getStorage = key => (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : []);

const setStorage = (key, newContact) => {
  const storage = getStorage(key);
  storage.push(newContact);
  localStorage.setItem(key, JSON.stringify(storage));
};

const removeStorage = (phoneNumber, key) => {
  const storage = getStorage(key);
  const newStorage = storage.filter(item => item.phone !== phoneNumber);
  localStorage.setItem(key, JSON.stringify(newStorage));
};

module.exports = {
  getStorage,
  setStorage,
  removeStorage,
};
