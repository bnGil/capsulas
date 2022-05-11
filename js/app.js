const input = document.getElementById("input");
const body = document.querySelector("body");
let container = document.querySelector(".container");
const category = document.getElementById("category");
const arrOfSortBtns = document.querySelectorAll(".sort-btn");
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

function filterPeople(peopleArr, input, cat) {
  if (cat === "everything") {
    return peopleArr.filter((person) =>
      Object.values(person).some((value) =>
        value.toString().toLowerCase().includes(input.toLowerCase())
      )
    );
  } else {
    return peopleArr.filter((person) =>
      person[cat].toLowerCase().includes(input.toLowerCase())
    );
  }
}

function searchHandler(e) {
  const currentInput = e.target.value;
  const currentCategory = category.value;
  const filteredPeople = filterPeople(people, currentInput, currentCategory);
  container.innerHTML = "";
  drawTable(filteredPeople);
}

function sortByNum(title) {
  people.sort((a, b) => Number(a[title]) - Number(b[title]));
  container.innerHTML = "";
  drawTable(people);
}

function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

function sortAlphabetic(title) {
  if (title === "last name") {
    title = toCamelCase(title);
  }
  if (title === "name") {
    title = "firstName";
  }
  people.sort(function (a, b) {
    const nameA = a[title].toUpperCase(); // ignore upper and lowercase
    const nameB = b[title].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  container.innerHTML = "";
  drawTable(people);
}

function sortHandler(e) {
  const title = e.target.innerText.toLowerCase();
  console.log(title);
  if (["id", "capsule", "age"].includes(title)) {
    sortByNum(title);
  } else {
    sortAlphabetic(title);
  }
}

const paintPage = async () => {
  people = await getArrOfPeople();
  const clonePeople = [...people];
  drawTable(people);
  input.addEventListener("keyup", searchHandler);
  arrOfSortBtns.forEach((e) => e.addEventListener("click", sortHandler));
};
paintPage();
