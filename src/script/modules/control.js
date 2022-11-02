import elems from './createElements';

import {renderContacts} from './render';

import * as storage from './serviceStorage';

const {createRow} = elems;

const sortData = (field, contactList) =>
  contactList.sort((a, b) => (a[field] > b[field] ? 1 : -1));

const hoverRow = (allRow, logo) => {
  const headerText = logo.textContent;

  allRow.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      logo.textContent = item.phoneLink.textContent;
    });

    item.addEventListener('mouseleave', () => {
      logo.textContent = headerText;
    });
  });
};

const modalControl = (btnAdd, formOverlay) => {
  const openModal = () => {
    if (!document.querySelector('.delete').classList.contains('is-visible')) {
      formOverlay.classList.add('is-visible');
    }
  };

  const closeModal = () => {
    formOverlay.classList.remove('is-visible');
  };

  btnAdd.addEventListener('click', openModal);

  formOverlay.addEventListener('click', ({target}) => {
    if (target === formOverlay || target.classList.contains('close')) {
      closeModal();
    }
  });

  return {
    closeModal,
  };
};

const deleteControl = (btnDel, list, key) => {
  btnDel.addEventListener('click', () => {
    document.querySelectorAll('.delete').forEach(del => {
      del.classList.toggle('is-visible');
    });
  });

  list.addEventListener('click', ({target}) => {
    if (target.closest('.del-icon')) {
      const tel = target.closest('.contact').querySelector('a').textContent;
      // data = data.filter(item => item['phone'] !== tel);
      storage.removeStorage(tel, key);
      target.closest('.contact').remove();
    }
  });
};

const sortFields = (thead, list, allRow, logo, key) => {
  thead.addEventListener('click', ({target}) => {
    const del = thead.querySelector('.delete');
    // eslint-disable-next-line max-len
    if (!del.classList.contains('is-visible') && (target.closest('.name') || target.closest('.surname'))) {
      // eslint-disable-next-line max-len
      allRow = [...renderContacts(list, sortData(target.className, storage.getStorage(key)))];
      localStorage.setItem('order', target.className);
      hoverRow(allRow, logo);
    }
  });
};

const addContactPage = (contact, list, logo) => {
  list.append(createRow(contact));
  hoverRow(list.querySelectorAll('tr'), logo);
};

const formControl = (form, list, closeModal, key, logo) => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newContact = Object.fromEntries(formData);

    addContactPage(newContact, list, logo);
    storage.setStorage(key, newContact);

    form.reset();
    closeModal();
  });
};

export default {
  sortData,
  hoverRow,
  modalControl,
  deleteControl,
  sortFields,
  addContactPage,
  formControl,
};
