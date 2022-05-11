const input = document.getElementById('input');
const body = document.querySelector('body');
const container = document.querySelector('.container');

async function getFetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getArrOfPeople() {
  const shortPeopleURL =
    'https://capsules-asb6.herokuapp.com/api/teacher/mordi';
  const peopleShortData = await getFetchData(shortPeopleURL);
  const personAPI = 'https://capsules-asb6.herokuapp.com/api/user/';
  const peopleFullData = await Promise.all(
    peopleShortData.map((person) => getFetchData(personAPI + person.id))
  );
  return peopleFullData;
}

const addTitleRow = (title) => {
  const titleBox = document.createElement('div');
  titleBox.classList.add('title');
  titleBox.textContent = title;
  container.appendChild(titleBox);
};
const addRow = (arrOfData) => {
  const row = document.createElement('div');
  row.classList.add('row');
  arrOfData.forEach((e) => {
    const cell = document.createElement('input');
    cell.classList.add('cell');
    cell.value = e;
    cell.setAttribute('readonly', true);
    row.appendChild(cell);
  });
  addButtons(row);
  container.appendChild(row);
};

const addButtons = (row) => {
  const editBtn = document.createElement('button');
  let oldRow = row.cloneNode(true);
  oldRow = oldRow.querySelectorAll('input.cell');

  row.appendChild(editBtn);
  editBtn.innerText = 'Edit';
  editBtn.classList.add('btn', 'edit-btn');
  editBtn.addEventListener('click', (e) => {
    row
      .querySelectorAll('input.cell')
      .forEach((input) => input.removeAttribute('readonly'));
    row
      .querySelectorAll('button')
      .forEach((button) => (button.style.display = 'none'));

    const confirm = document.createElement('button');
    confirm.textContent = 'confirm';
    // confirm.classList.add('btn');
    row.appendChild(confirm);

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    // cancel.classList.add('btn');
    row.appendChild(cancel);

    cancel.addEventListener('click', (e) => {
      row
        .querySelectorAll('input')
        .forEach((input, index) => (input.value = oldRow[index].value));
      row.querySelector('.edit-btn').style.display = 'block';
      row.querySelector('.delete-btn').style.display = 'block';
      cancel.remove();
      confirm.remove();
      row
        .querySelectorAll('input.cell')
        .forEach((input) => input.setAttribute('readonly', 'true'));
      // console.log('clicked');
      // oldRow.forEach((input) => console.log(input.value));
    });

    confirm.addEventListener('click', (e) => {
      people.find((person) => {
        console.log(person);
      });
      // console.log('id : ', row.querySelector(':first-child').value);
      row
        .querySelectorAll('input')
        .forEach((input, index) => (input.value = input.value));
      row.querySelector('.edit-btn').style.display = 'block';
      row.querySelector('.delete-btn').style.display = 'block';
      cancel.remove();
      confirm.remove();
      row
        .querySelectorAll('input.cell')
        .forEach((input) => input.setAttribute('readonly', 'true'));
      // console.log('clicked');
      // oldRow.forEach((input) => console.log(input.value));
    });

    console.log(row);
  });

  const deleteBtn = document.createElement('button');
  row.appendChild(deleteBtn);
  deleteBtn.innerText = 'Delete';
  deleteBtn.classList.add('btn', 'delete-btn');
  deleteBtn.addEventListener('click', (e) => {});
};

const drawTable = (arrOfData) => {
  arrOfData.forEach((person) => {
    addRow([
      person.id,
      person.firstName,
      person.lastName,
      person.capsule,
      person.age,
      person.city,
      person.gender,
      person.hobby,
    ]);
  });
};
const paintPage = async () => {
  drawTable(await getArrOfPeople());
};
paintPage();
