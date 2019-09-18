const baseLink = "http://petlatkea.dk/2019/students1991.json";
const template = document.querySelector("template").content;
const list = document.querySelector(".list");
let allStudents = [];
let currentList = [];

//Object prototype
const student = {
  firstname: "-firstname-",
  lastname: "-lastname-",
  house: "-house-",
  id: "-id-"
};

//fetching elements
function fetchJSON() {
  fetch(baseLink)
    .then(e => e.json()).then(data => {
      createObjects(data);
    });
}

//create clean data
function createObjects(studentsJson) {
  studentsJson.forEach(oneStudent => {
    //Create new student object
    const studentObj = Object.create(student);

    const studentSplit = oneStudent.fullname.split(" ");

    studentObj.firstname = studentSplit[0];
    studentObj.lastname = studentSplit[1];
    studentObj.house = oneStudent.house;
    studentObj.id = createUUID();

    //objects added in the array
    allStudents.push(studentObj);
  });

  //console.log(allStudents);
  displayList(allStudents);
}

const sortOptions = Array.from(document.querySelectorAll(".sortDropDown .sortOpt p"));
const filterOptions = Array.from(document.querySelectorAll(".filterDropDown .filterOpt p"));

window.addEventListener("load", loadPage);

function loadPage() {
  document.querySelector(".sortDropDown .sortOpt").addEventListener("click", selectedSorting);
  document.querySelector(".filterDropDown .filterOpt").addEventListener("click", selectedFilter);
  fetchJSON();
}

/************SORTING OPTIONS***************/
function selectedSorting(option) {
  sortOptions.forEach(notSelected);

  let sortingOption = option.target;

  if (sortingOption.dataset.action === "sorting") {
    //console.log(option.target.textContent);
    sortingOption.style.backgroundColor = "blue";
    sortBy(sortingOption.dataset.field);
    displayList(currentList);
  }
}

/***********FILTER OPTIONS******************/
function selectedFilter(option) {
  filterOptions.forEach(notSelected);

  let filterOption = option.target;

  if (filterOption.dataset.action === "filter") {
    //console.log(option.target.textContent);
    filterOption.style.backgroundColor = "blue";
    console.log(filterOption.textContent);
    filterBy(filterOption.dataset.field);
    console.log(currentList);
    displayList(currentList);
  }
}

//remove highlighted sorting option when it's not selected
function notSelected(option) {
  option.style.backgroundColor = "transparent";
}

function displayList(studentsArr) {
  //empty previous list
  deleteChild();

  //generate a new array
  currentList = allStudents;

  currentList.forEach(displayStudent);
}

function displayStudent(student) {

  const myClone = template.cloneNode(true);

  myClone.querySelector("[data-field=firstname]").textContent = student.firstname;
  myClone.querySelector("[data-field=lastname]").textContent = student.lastname;
  myClone.querySelector("[data-field=house]").textContent = student.house;

  //myClone.querySelector("[data-action=details]").addEventListener("click", showDetails);

  list.appendChild(myClone);
}

/*************SORTING********************/
function sortBy(sortBy) {
  currentList.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });

  console.log(currentList);
}

function filterBy(house) {
  currentList = allStudents.filter(student => {
    return student.house === house;
  });
}

// function display(one) {
//   console.log(one.firstname);
// }

// //show details in modal----UNDONE
// //MODAL
// const modal = document.querySelector(".modal");
// const modalCross = document.querySelector(".modal#cross");

// modal.style.display = "none";

// function showDetails() {
//   modal.style.display = "block";

//   //closing the modal
//   modalCross.addEventListener("click", function () {
//     modal.style.display = "none";
//   });
// }

// function displayArr(arrStud) {
//   //Reseting the previous sorting/filtering
//   //deleteChild();

//   function displayStud(student) {
//     const myClone = template.cloneNode(true);

//     myClone.querySelector("h1").textContent = student;

//     list.appendChild(myClone);
//     //console.log(arrStud[i]);
//   }

//   //assign each element inside the array and create new list
//   arrStud.forEach(displayStud);
// }

// //reset all the .list content (student list displayed)
// //found on https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
// function deleteChild() {
//   const parent = document.querySelector(".list");
//   let child = parent.lastElementChild;

//   //while there is child inside this div .list => remove it
//   while (child) {
//     parent.removeChild(child);
//     child = parent.lastElementChild;
//   }
// }

// //function sort by None
// const sortNoneBtn = document.querySelector("#sortNone");
// sortNoneBtn.addEventListener("click", displayList);

// //function sort by firt name
// const sortFirstBtn = document.querySelector("#sortFirst");
// sortFirstBtn.addEventListener("click", sortFirstList);

// function sortFirstList() {
//   const arrStud = [];

//   fetchJSON(sortFirstName);

//   function sortFirstName(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting all names (first and last) inside an array
//       arrStud.push(oneStudent.fullname);
//     });

//     //sort the array
//     arrStud.sort();
//     //console.log(arrStud);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     // for (let i = 0; i < arrStud.length; i++) {
//     //   const myClone = template.cloneNode(true);

//     //   myClone.querySelector("h1").textContent = arrStud[i];

//     //   list.appendChild(myClone);
//     //   console.log(arrStud[i]);
//     // }
//     displayArr(arrStud);
//   }
// }

// //function sort by house
// const sortHouseBtn = document.querySelector("#sortHouse");

// sortHouseBtn.addEventListener("click", sortHouseList);

// function sortHouseList() {
//   const arrHuffle = [];
//   const arrGryff = [];
//   const arrSly = [];
//   const arrRav = [];
//   let allHouses = [];
//   let houseName = [];
//   const houseGryff = [];
//   const houseHuffle = [];
//   const houseSly = [];
//   const houseRav = [];

//   fetchJSON(sortHouse);

//   function sortHouse(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting each student inside correspondant house
//       //synchronizing house name array with student name array
//       if (oneStudent.house == "Gryffindor") {
//         arrGryff.push(oneStudent.fullname);
//         houseGryff.push(oneStudent.house);
//       } else if (oneStudent.house == "Hufflepuff") {
//         arrHuffle.push(oneStudent.fullname);
//         houseHuffle.push(oneStudent.house);
//       } else if (oneStudent.house == "Slytherin") {
//         arrSly.push(oneStudent.fullname);
//         houseSly.push(oneStudent.house);
//       } else {
//         arrRav.push(oneStudent.fullname);
//         houseRav.push(oneStudent.house);
//       }
//     });

//     //put all arrays into ONE
//     allHouses = arrGryff.concat(arrHuffle, arrSly, arrRav);
//     //console.log(allHouses);
//     houseName = houseGryff.concat(houseHuffle, houseSly, houseRav);
//     //console.log(houseName);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     for (let i = 0; i < allHouses.length; i++) {
//       const myClone = template.cloneNode(true);

//       myClone.querySelector("h1").textContent = allHouses[i];
//       myClone.querySelector("p").textContent = houseName[i];

//       list.appendChild(myClone);
//     }
//   }
// }

// //function sort by last name

// //function filter: All
// const filterAllBtn = document.querySelector("#filterAll");
// filterAllBtn.addEventListener("click", sortHouseList);

// //function filter: Gryffindor
// const filterGryffBtn = document.querySelector("#filterGryff");

// filterGryffBtn.addEventListener("click", gryffOnlyList);

// function gryffOnlyList() {
//   const gryffOnlyStud = [];

//   fetch(baseLink)
//     .then(e => e.json())
//     .then(data => filterGryffOnly(data));

//   function filterGryffOnly(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting each student belonging to Gryffindor in 1 array
//       if (oneStudent.house == "Gryffindor") {
//         gryffOnlyStud.push(oneStudent.fullname);
//       }
//     });

//     console.log(gryffOnlyStud);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     for (let i = 0; i < gryffOnlyStud.length; i++) {
//       const myClone = template.cloneNode(true);

//       myClone.querySelector("h1").textContent = gryffOnlyStud[i];
//       myClone.querySelector("p").textContent = "Gryffindor";

//       list.appendChild(myClone);
//     }
//   }
// }

// //function filter: Hufflepuff
// const filterHuffBtn = document.querySelector("#filterHuff");

// filterHuffBtn.addEventListener("click", huffOnlyList);

// function huffOnlyList() {
//   const huffOnlyStud = [];

//   fetch(baseLink)
//     .then(e => e.json())
//     .then(data => filterHuffOnly(data));

//   function filterHuffOnly(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting each student belonging to Gryffindor in 1 array
//       if (oneStudent.house == "Hufflepuff") {
//         huffOnlyStud.push(oneStudent.fullname);
//       }
//     });

//     console.log(huffOnlyStud);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     for (let i = 0; i < huffOnlyStud.length; i++) {
//       const myClone = template.cloneNode(true);

//       myClone.querySelector("h1").textContent = huffOnlyStud[i];
//       myClone.querySelector("p").textContent = "Hufflepuff";

//       list.appendChild(myClone);
//     }
//   }
// }

// //function filter: Slytherin
// const filterSlyBtn = document.querySelector("#filterSlyth");

// filterSlyBtn.addEventListener("click", slyOnlyList);

// function slyOnlyList() {
//   const slyOnlyStud = [];

//   fetch(baseLink)
//     .then(e => e.json())
//     .then(data => filterSlyOnly(data));

//   function filterSlyOnly(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting each student belonging to Gryffindor in 1 array
//       if (oneStudent.house == "Slytherin") {
//         slyOnlyStud.push(oneStudent.fullname);
//       }
//     });

//     console.log(slyOnlyStud);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     for (let i = 0; i < slyOnlyStud.length; i++) {
//       const myClone = template.cloneNode(true);

//       myClone.querySelector("h1").textContent = slyOnlyStud[i];
//       myClone.querySelector("p").textContent = "Slytherin";

//       list.appendChild(myClone);
//     }
//   }
// }

// //function filter: Ravenlaw
// const filterRavBtn = document.querySelector("#filterRav");

// filterRavBtn.addEventListener("click", ravOnlyList);

// function ravOnlyList() {
//   const ravOnlyStud = [];

//   fetch(baseLink)
//     .then(e => e.json())
//     .then(data => filterRavOnly(data));

//   function filterRavOnly(allStudent) {
//     allStudent.forEach(oneStudent => {
//       //putting each student belonging to Gryffindor in 1 array
//       if (oneStudent.house == "Ravenclaw") {
//         ravOnlyStud.push(oneStudent.fullname);
//       }
//     });

//     console.log(ravOnlyStud);

//     //move content from the array to the html studentName
//     //first: reset the previous list w/ this function
//     deleteChild();

//     //assign each element inside the array and create new list
//     for (let i = 0; i < ravOnlyStud.length; i++) {
//       const myClone = template.cloneNode(true);

//       myClone.querySelector("h1").textContent = ravOnlyStud[i];
//       myClone.querySelector("p").textContent = "Ravenclaw";

//       list.appendChild(myClone);
//     }
//   }
// }

/*************************************** */
//generate uuid: unique id
//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function createUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

//reset all the .list content (student list displayed)
//found on https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
function deleteChild() {
  const parent = document.querySelector(".list");
  let child = parent.lastElementChild;

  //while there is child inside this div .list => remove it
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}