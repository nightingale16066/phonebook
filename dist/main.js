(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const {
  createRow,
} = require('./createElements');

const {
  renderContacts,
} = require('./render');

const {
  getStorage,
  setStorage,
  removeStorage,
} = require('./serviceStorage');

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
      removeStorage(tel, key);
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
      allRow = [...renderContacts(list, sortData(target.className, getStorage(key)))];
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
    setStorage(key, newContact);

    form.reset();
    closeModal();
  });
};

module.exports = {
  sortData,
  hoverRow,
  modalControl,
  deleteControl,
  sortFields,
  addContactPage,
  formControl,
};

},{"./createElements":2,"./render":3,"./serviceStorage":4}],2:[function(require,module,exports){
'use strict';

const createContainer = () => {
  const container = document.createElement('div');
  container.classList.add('container');
  return container;
};

const createHeader = () => {
  const header = document.createElement('header');
  header.classList.add('header');

  const headerContainer = createContainer();
  header.append(headerContainer);

  header.headerContainer = headerContainer;

  return header;
};

const createMain = () => {
  const main = document.createElement('main');
  const mainContainer = createContainer();

  main.append(mainContainer);
  main.mainContainer = mainContainer;

  return main;
};

const createLogo = title => {
  const h1 = document.createElement('h1');
  h1.classList.add('logo');
  h1.textContent = `Телефонный справочник. ${title}`;

  return h1;
};

const createButtonsGroup = params => {
  const btnWrapper = document.createElement('div');
  btnWrapper.classList.add('btn-wrapper');

  const btns = params.map(({className, type, text}) => {
    const button = document.createElement('button');
    button.type = type;
    button.className = className;
    button.textContent = text;
    return button;
  });

  btnWrapper.append(...btns);

  return {
    btnWrapper,
    btns,
  };
};

const createTable = () => {
  const table = document.createElement('table');
  table.classList.add('table', 'table-striped');

  const thead = document.createElement('thead');
  thead.insertAdjacentHTML('beforeend', `
    <tr>
      <th class='delete'>Удалить</th>
      <th class='name'>Имя</th>
      <th class='surname'>Фамилия</th>
      <th>Телефон</th>
      <th></th>
    </tr>  
  `);

  const tbody = document.createElement('tbody');

  table.append(thead, tbody);
  table.thead = thead;
  table.tbody = tbody;

  return table;
};

const createForm = () => {
  const overlay = document.createElement('div');
  overlay.classList.add('form-overlay');

  const form = document.createElement('form');
  form.classList.add('form');
  form.insertAdjacentHTML('beforeend', `
    <button class='close' type='button'></button>
    <h2 class='form-title'>Добавить контакт</h2>
    <div class='form-group'>
      <label class='form-label' for='name'>Имя</label>
      <input class='form-input' name='name' id='name' type='text' required>
    </div>
    <div class='form-group'>
      <label class='form-label' for='surname'>Фамилия</label>
      <input class='form-input' name='surname'
        id='surname' type='text' required>
    </div>
    <div class='form-group'>
      <label class='form-label' for='phone'>Телефон</label>
      <input class='form-input' name='phone'
        id='phone' type='number' required>
    </div>
  `);

  const buttonsGroup = createButtonsGroup([
    {
      className: 'btn btn-primary mr-3',
      type: 'submit',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'reset',
      text: 'Отмена',
    },
  ]);

  form.append(...buttonsGroup.btns);
  overlay.append(form);

  return {
    overlay,
    form,
  };
};

const createFooterText = title => {
  const h3 = document.createElement('h3');
  h3.classList.add('footer__title');
  h3.textContent = `Все права защищены ©${title}`;

  return h3;
};

const createFooter = () => {
  const footer = document.createElement('footer');
  footer.classList.add('footer');

  const footerComtainer = createContainer();
  footer.append(footerComtainer);

  footer.footerComtainer = footerComtainer;

  return footer;
};

const createRow = ({name: firstname, surname, phone}) => {
  const tr = document.createElement('tr');
  tr.classList.add('contact');

  const tdDel = document.createElement('td');
  tdDel.classList.add('delete');
  const buttonDel = document.createElement('button');
  buttonDel.classList.add('del-icon');
  tdDel.append(buttonDel);

  const tdName = document.createElement('td');
  tdName.textContent = firstname;

  const tdSurname = document.createElement('td');
  tdSurname.textContent = surname;

  const tdPhone = document.createElement('td');
  const phoneLink = document.createElement('a');
  phoneLink.href = `tel: ${phone}`;
  phoneLink.textContent = phone;
  tr.phoneLink = phoneLink;

  tdPhone.append(phoneLink);

  const tdEdit = document.createElement('td');
  tdEdit.classList.add('edit-btn__container');
  const buttonEdit = document.createElement('button');
  buttonEdit.classList.add('btn-edit');
  tdEdit.append(buttonEdit);

  tr.append(tdDel, tdName, tdSurname, tdPhone, tdEdit);
  return tr;
};

module.exports = {
  createContainer,
  createHeader,
  createMain,
  createLogo,
  createButtonsGroup,
  createTable,
  createForm,
  createFooterText,
  createFooter,
  createRow,
};

},{}],3:[function(require,module,exports){
'use strict';

const {
  createHeader,
  createMain,
  createLogo,
  createButtonsGroup,
  createTable,
  createForm,
  createFooterText,
  createFooter,
  createRow,
} = require('./createElements');

const renderPhoneBook = (app, title) => {
  const header = createHeader();
  const logo = createLogo(title);
  const main = createMain();
  const buttonsGroup = createButtonsGroup([
    {
      className: 'btn btn-primary mr-3',
      type: 'button',
      text: 'Добавить',
    },
    {
      className: 'btn btn-danger',
      type: 'button',
      text: 'Удалить',
    },
  ]);
  const table = createTable();
  const {
    form,
    overlay,
  } = createForm();
  const footer = createFooter();
  const footerText = createFooterText(title);

  header.headerContainer.append(logo);
  main.mainContainer.append(buttonsGroup.btnWrapper, table, overlay);
  footer.footerComtainer.append(footerText);

  app.append(header, main, footer);

  return {
    list: table.tbody,
    logo,
    btnAdd: buttonsGroup.btns[0],
    btnDel: buttonsGroup.btns[1],
    formOverlay: overlay,
    form,
    thead: table.thead,
  };
};

const renderContacts = (elem, data) => {
  elem.innerHTML = '';
  const allRow = data.map(createRow);
  elem.append(...allRow);
  return allRow;
};

module.exports = {
  renderPhoneBook,
  renderContacts,
};

},{"./createElements":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

const {
  sortData,
  hoverRow,
  modalControl,
  deleteControl,
  sortFields,
  formControl,
} = require('./modules/control');


const {
  renderPhoneBook,
  renderContacts,
} = require('./modules/render');

const {
  getStorage,
} = require('./modules/serviceStorage');

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


},{"./modules/control":1,"./modules/render":3,"./modules/serviceStorage":4}]},{},[5]);
