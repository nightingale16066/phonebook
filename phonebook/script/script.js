import control from './modules/control.js';

import {renderPhoneBook, renderContacts} from './modules/render.js';

import {getStorage} from './modules/serviceStorage.js';

const {
  sortData,
  hoverRow,
  modalControl,
  deleteControl,
  sortFields,
  formControl,
} = control;

{
  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);
    const key = 'data';

    const {
      list,
      logo,
      btnAdd,
      formOverlay,
      btnDel,
      form,
      thead,
    } = renderPhoneBook(app, title);

    const allRow = localStorage.getItem('order') ?
      // eslint-disable-next-line max-len
      [...renderContacts(list, sortData(localStorage.getItem('order'), getStorage(key)))] :
      renderContacts(list, getStorage(key));

    const {closeModal} = modalControl(btnAdd, formOverlay);

    hoverRow(allRow, logo);
    deleteControl(btnDel, list, key);
    sortFields(thead, list, allRow, logo, key);
    formControl(form, list, closeModal, key, logo);
  };

  window.phoneBookInit = init;
}


