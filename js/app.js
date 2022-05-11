const input = document.getElementById("input");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const category = document.getElementById("category");
let people;

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
  const titleBox = document.createElement("div");
  titleBox.classList.add("title");
  titleBox.textContent = title;
  container.appendChild(titleBox);
};

const addRow = (arrOfData) => {
  const row = document.createElement("div");
  row.classList.add("row");
  arrOfData.forEach((e) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = e;
    row.appendChild(cell);
  });
  addButtons(row);
  container.appendChild(row);
};

const addButtons = (row) => {
  const editBtn = document.createElement("button");
  row.appendChild(editBtn);
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "edit-btn");
  const deleteBtn = document.createElement("button");
  row.appendChild(deleteBtn);
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("btn", "delete-btn");
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

function searchHandler(e) {
  const currentInput = e.target.value;
  const currentCategory = category.value;
  // const filteredPeople = people.filter( person =>person[currentCategory].includes(currentInput) )
  // drawTable(filteredPeople)
}

const paintPage = async () => {
  people = await getArrOfPeople();
  const clonePeople = [...people];
  drawTable(people);
  input.addEventListener("keyup", searchHandler);
};
paintPage();
