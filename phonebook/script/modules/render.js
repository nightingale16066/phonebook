import elems from './createElements.js';

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
} = elems;

export const renderPhoneBook = (app, title) => {
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

export const renderContacts = (elem, data) => {
  elem.innerHTML = '';
  const allRow = data.map(createRow);
  elem.append(...allRow);
  return allRow;
};

