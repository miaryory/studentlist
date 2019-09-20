"use strict";

const baseLink = "http://petlatkea.dk/2019/hogwartsdata/students.json";
const template = document.querySelector("template").content;
const list = document.querySelector(".list");
let allStudents = [];
let currentList = [];
let expelledList = [];
let nonExpelledList = [];

//menu format for small screen view
const menuOnMobile = document.querySelector(".burgerMenu");

menuOnMobile.addEventListener("click", function() {
  document.querySelector(".allOpt").classList.toggle("show");
  document.querySelector(".main").classList.toggle("moveMain");
  document.querySelector("#menuMobile").classList.toggle("moveMain");
  document.querySelector(".tableHeader").classList.toggle("moveList");
  list.classList.toggle("moveList");
});

window.addEventListener("scroll", fixMenu);

function fixMenu() {
  const bodyHeight = Math.floor(window.scrollY);

  if (bodyHeight > 84) {
    document.querySelector("#menuMobile").style.top = "10px";
  } else {
    document.querySelector("#menuMobile").style.top = "inherit";
  }
}

//Object prototype
const student = {
  firstname: "-firstname-",
  middlename: "-middlename-",
  lastname: "-lastname-",
  gender: "-gender-",
  house: "-house-",
  id: "-id-",
  expelled: false
};

//fetching elements
function fetchJSON() {
  fetch(baseLink)
    .then(e => e.json())
    .then(data => {
      createObjects(data);
    });
}

//create clean data
function createObjects(studentsJson) {
  studentsJson.forEach(oneStudent => {
    //Create new student object
    const studentObj = Object.create(student);
    const studentSplit = capitalization(oneStudent.fullname).split(" ");

    studentObj.firstname = studentSplit[0];
    studentObj.lastname = studentSplit[studentSplit.length - 1];
    if (studentSplit.length > 2) {
      studentObj.middlename = studentSplit.slice(1, studentSplit.length - 1);
    } else {
      studentObj.middlename = "";
    }
    studentObj.gender = capitalization(oneStudent.gender);
    studentObj.house = capitalization(oneStudent.house);
    studentObj.id = createUUID();
    studentObj.expelled = false;

    //objects added in the array
    allStudents.push(studentObj);
  });

  displayList(allStudents);
}

//fixing name formats
function capitalization(fullname) {
  const newNameFormat = [];
  const nameParts = fullname.trim().split(" ");

  nameParts.forEach(capitalize);

  function capitalize(name) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    newNameFormat.push(name);
  }

  return newNameFormat.join(" ");
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
    filterOption.style.backgroundColor = "blue";

    filterBy(filterOption.dataset.field);
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
  currentList = studentsArr;

  currentList.forEach(displayStudent);
}

function displayStudent(student) {
  const myClone = template.cloneNode(true);

  myClone.querySelector("[data-field=fullname]").textContent = student.firstname + " " + student.lastname;
  myClone.querySelector("[data-field=house]").textContent = student.house;
  myClone.querySelector("[data-action=details]").dataset.attribute = student.id;

  myClone.querySelector("[data-action=details]").addEventListener("click", showDetails);

  list.appendChild(myClone);
}

/*************SORTING********************/
function sortBy(sortBy) {
  currentList.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });

  //console.log(currentList);
}

/*************FILTERING********************/
function filterBy(filter) {
  if (filter === "Expelled") {
    displayList(expelledList);
  } else if (filter === "Non-expelled") {
    displayList(nonExpelledList);
  } else {
    // const sotingByHouseDisaled = document.querySelector(".sortDropDown .sortOpt");

    // sotingByHouseDisaled.querySelector("[data-field=house]").removeEventListener("click", selectedSorting);
    // sotingByHouseDisaled.querySelector("[data-field=house]").style.color = "red";

    currentList = allStudents.filter(student => {
      return student.house === filter;
    });
  }
}

/*************MODAL********************/
function showDetails(event) {
  const modal = document.querySelector(".modal");
  const modalCross = document.querySelector(".modal #cross");

  window.addEventListener("scroll", noScroll);

  document.querySelector(".modal").classList.add("showModal");
  document.querySelector(".main").classList.add("moveMain");
  document.querySelector("#menuMobile").classList.add("moveMain");
  document.querySelector(".tableHeader").classList.add("moveList");
  list.classList.add("moveList");

  const id = event.target.dataset.attribute;

  const studentIndex = currentList.findIndex(findId);
  modal.querySelector(".name").textContent = currentList[studentIndex].firstname + " " + currentList[studentIndex].middlename + " " + currentList[studentIndex].lastname;
  modal.querySelector(".gender").textContent = currentList[studentIndex].gender;
  modal.querySelector(".house").textContent = currentList[studentIndex].house;
  modal.querySelector("[data-action=expel]").dataset.attribute = currentList[studentIndex].id;

  modal.querySelector("[data-action=expel]").addEventListener("click", expelStudent);

  const studentPic = "images/" + currentList[studentIndex].lastname.toLowerCase() + "_" + currentList[studentIndex].firstname.charAt(0).toLowerCase() + ".png";
  if (studentPic != undefined) {
    modal.querySelector(".pic").src = studentPic;
  } else {
    modal.querySelector(".pic").style.display = "none";
  }

  houseCrest(currentList[studentIndex].house);

  function findId(student) {
    if (student.id === id) {
      return true;
    } else {
      return false;
    }
  }

  //closing the modal
  modalCross.addEventListener("click", function() {
    window.removeEventListener("scroll", noScroll);

    document.querySelector(".modal").classList.remove("showModal");
    document.querySelector(".main").classList.remove("moveMain");
    document.querySelector("#menuMobile").classList.remove("moveMain");
    document.querySelector(".tableHeader").classList.remove("moveList");
    list.classList.remove("moveList");
  });
}

//theme changer of the modal
function houseCrest(housename) {
  document.querySelector(".modal").querySelector("article").dataset.theme = housename.toLowerCase();
  document.querySelector(".modal").querySelector(".crest").src = "crest/" + housename.toLowerCase() + ".jpg";
}

/******************EXPELLING************************/
function expelStudent(event) {
  //AND CLOSE THE MODAL **********SOME ANIMATION HERE TOO*********
  window.removeEventListener("scroll", noScroll);
  document.querySelector(".modal").classList.remove("showModal");
  document.querySelector(".main").classList.remove("moveMain");
  document.querySelector("#menuMobile").classList.remove("moveMain");
  document.querySelector(".tableHeader").classList.remove("moveList");
  list.classList.remove("moveList");

  const id = event.target.dataset.attribute;

  const indexStudent = currentList.findIndex(studentID);

  //mark student as expelled
  currentList[indexStudent].expelled = true;

  //remove expell btn ******MAKE SOME ANIMATION HERE***********
  // if (document.querySelector(".modal").querySelector("[data-action=expel]").dataset.attribute === currentList[indexStudent].id) {
  //   document.querySelector(".modal").querySelector("[data-action=expel]").style.display = "none";
  // } else {
  //   document.querySelector(".modal").querySelector("[data-action=expel]").style.display = "block";
  // }

  //add student to expelled list
  expelledList.push(currentList[indexStudent]);

  //delete it from both lists
  currentList.splice(indexStudent, 1);

  const indexStudent2 = allStudents.findIndex(studentID);
  allStudents.splice(indexStudent2, 1);
  nonExpelledList = allStudents;

  function studentID(student) {
    if (student.id === id) {
      return true;
    } else {
      return false;
    }
  }

  //remove it from display
  const element = list.querySelector('.student button[data-attribute="' + id + '"]');

  element.parentElement.remove();
  console.log(currentList);
}

//disable window scrolling when modal is open
//https://davidwells.io/snippets/disable-scrolling-with-javascript
function noScroll() {
  window.scrollTo(0, 0);
}

//generate uuid: unique id
//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function createUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
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
