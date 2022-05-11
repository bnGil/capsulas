async function getFetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getPeople() {
  const shortPeopleURL =
    'https://capsules-asb6.herokuapp.com/api/teacher/mordi';
  const peopleShortData = await getFetchData(shortPeopleURL);
  const personAPI = 'https://capsules-asb6.herokuapp.com/api/user/';
  const peopleFullData = await Promise.all(
    peopleShortData.map((person) => getFetchData(personAPI + person.id))
  );
  console.log(peopleFullData);
}

getPeople();
