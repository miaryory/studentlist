"use strict";

const baseLink = "https://petlatkea.dk/2019/hogwartsdata/students.json";
const nameslink = "https://petlatkea.dk/2019/hogwartsdata/families.json";
const template = document.querySelector("template").content;
const list = document.querySelector(".list");
let allStudents = [];
let currentList = [];
let expelledList = [];
let nonExpelledList = [];
let pure = [];
let half = [];

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
  expelled: false,
  prefect: false,
  blood: "-blood-status-",
  inquisitorial: false
};

//hacking part
const miary = {
  firstname: "Miary",
  middlename: "Mahandry",
  lastname: "Ory",
  gender: "Girl",
  house: "Ravenclaw",
  id: createUUID(),
  expelled: false,
  prefect: false,
  blood: "Pure blood",
  inquisitorial: false
};

//fetching elements
function fetchJSON() {
  fetch(baseLink)
    .then(e => e.json())
    .then(data => {
      createObjects(data);
    });
}

const sortOptions = Array.from(
  document.querySelectorAll(".sortDropDown .sortOpt p")
);
const filterOptions = Array.from(
  document.querySelectorAll(".filterDropDown .filterOpt p")
);

window.addEventListener("load", loadPage);

function loadPage() {
  document
    .querySelector(".sortDropDown .sortOpt")
    .addEventListener("click", selectedSorting);
  document
    .querySelector(".filterDropDown .filterOpt")
    .addEventListener("click", selectedFilter);
  fetchJSON();
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
    studentObj.prefect = false;
    studentObj.inquisitorial = false;

    fetchNamesJSON(); //setting blood status

    //fetch family names
    function fetchNamesJSON() {
      fetch(nameslink)
        .then(e => e.json())
        .then(data => {
          storeNames(data);
        });
    }

    function storeNames(familyNames) {
      familyNames.pure.forEach(name => {
        pure.push(name);
      });
      familyNames.half.forEach(name => {
        half.push(name);
      });

      bloodStatus();
    }

    /**********BLOOD STATUS*************/
    function bloodStatus() {
      if (
        pure.includes(studentObj.lastname) &&
        !half.includes(studentObj.lastname)
      ) {
        studentObj.blood = "Pure blood";
      } else if (
        !pure.includes(studentObj.lastname) &&
        half.includes(studentObj.lastname)
      ) {
        studentObj.blood = "Muggle";
      } else if (
        pure.includes(studentObj.lastname) &&
        half.includes(studentObj.lastname)
      ) {
        studentObj.blood = "Pure blood";
      } else {
        studentObj.blood = "";
      }
    }

    //objects added in the array
    allStudents.push(studentObj);
  });
  allStudents.push(miary);
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

/************SORTING OPTIONS***************/
function selectedSorting(option) {
  sortOptions.forEach(notSelected);

  let sortingOption = option.target;

  if (sortingOption.dataset.action === "sorting") {
    sortingOption.classList.add("selected");

    sortBy(sortingOption.dataset.field);
    displayList(currentList);
  }
}

/***********FILTER OPTIONS******************/
function selectedFilter(option) {
  filterOptions.forEach(notSelected);

  let filterOption = option.target;

  if (filterOption.dataset.action === "filter") {
    filterOption.classList.add("selected");

    filterBy(filterOption.dataset.field);
    displayList(currentList);
  }
}

//remove highlighted sorting option when it's not selected
function notSelected(option) {
  option.classList.remove("selected");
}

function displayList(studentsArr) {
  //empty previous list
  deleteChild();

  //generate a new array
  currentList = studentsArr;
  nonExpelledList = allStudents.filter(student => {
    return student.expelled === false;
  });

  currentList.forEach(displayStudent);
  countStudents(allStudents, nonExpelledList);
}

function displayStudent(student) {
  const myClone = template.cloneNode(true);

  myClone.querySelector("[data-field=fullname]").textContent =
    student.firstname + " " + student.lastname;
  myClone.querySelector("[data-field=house]").textContent = student.house;
  myClone.querySelector("[data-action=details]").dataset.attribute = student.id;

  //expelled student cannot be prefect or in inquisitorial squad anymore
  if (student.expelled === true) {
    myClone.querySelector("[data-action=prefect]").style.display = "none";
    myClone.querySelector("[data-action=inquisitorial]").style.display = "none";
  }

  myClone.querySelector("[data-action=prefect]").dataset.attribute = student.id;
  myClone.querySelector("[data-action=inquisitorial]").dataset.attribute =
    student.id;

  myClone
    .querySelector("[data-action=details]")
    .addEventListener("click", showDetails);
  myClone
    .querySelector("[data-action=prefect]")
    .addEventListener("click", managePrefect);
  myClone
    .querySelector("[data-action=inquisitorial]")
    .addEventListener("click", manageSquad);

  list.appendChild(myClone);
}

/*************NUMBER OF STUDENTS********************/
function countStudents(countAllStudents, countNonExpelledList) {
  let g = 0;
  let s = 0;
  let h = 0;
  let r = 0;
  const allHouses = Array.from(countAllStudents);

  for (let i = 0; i < allHouses.length; i++) {
    if (allHouses[i].house === "Gryffindor") {
      g++;
    } else if (allHouses[i].house === "Slytherin") {
      s++;
    } else if (allHouses[i].house === "Hufflepuff") {
      h++;
    } else if (allHouses[i].house === "Ravenclaw") {
      r++;
    }
  }

  filterOptions[0].textContent = "Gryffindor (" + g + ")";
  filterOptions[1].textContent = "Slytherin (" + s + ")";
  filterOptions[2].textContent = "Hufflepuff (" + h + ")";
  filterOptions[3].textContent = "Ravenclaw (" + r + ")";
  filterOptions[4].textContent =
    "Non-Expelled Students (" + countNonExpelledList.length + ")";
  filterOptions[5].textContent =
    "Expelled Students (" + expelledList.length + ")";
}

/*************SORTING********************/
function sortBy(sortBy) {
  currentList.sort((a, b) => {
    return a[sortBy].localeCompare(b[sortBy]);
  });
}

/*************FILTERING********************/
function filterBy(filter) {
  if (filter === "Expelled") {
    document.querySelector(".tableHeader p.prefect-status").style.display =
      "none";
    document.querySelector(".tableHeader p.inqui-squad").style.display = "none";
    displayList(expelledList);
  } else if (filter === "Non-expelled") {
    document.querySelector(".tableHeader p.prefect-status").style.display =
      "block";
    document.querySelector(".tableHeader p.inqui-squad").style.display =
      "block";
    displayList(nonExpelledList);
  } else {
    document.querySelector(".tableHeader p.prefect-status").style.display =
      "block";
    document.querySelector(".tableHeader p.inqui-squad").style.display =
      "block";
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
  modal.querySelector(".name").textContent =
    currentList[studentIndex].firstname +
    " " +
    currentList[studentIndex].middlename +
    " " +
    currentList[studentIndex].lastname;
  if (currentList[studentIndex].gender === "Girl") {
    modal.querySelector(".gender").src = "female.png";
  } else if (currentList[studentIndex].gender === "Boy") {
    modal.querySelector(".gender").src = "male.png";
  }

  const bloodStatus = ["Pure blood", "Half blood", "Muggle"];

  //hack part of blood status
  if (currentList[studentIndex].blood == "Pure blood") {
    modal.querySelector(".blood").textContent =
      bloodStatus[Math.floor(Math.random() * bloodStatus.length)];
  } else {
    modal.querySelector(".blood").textContent = "Pure blood";
  }

  modal.querySelector(".house").textContent = currentList[studentIndex].house;

  if (currentList[studentIndex].expelled === true) {
    //remove button if already expelled
    modal.querySelector("[data-action=expel]").style.display = "none";
  } else {
    modal.querySelector("[data-action=expel]").style.display = "block";
    modal.querySelector("[data-action=expel]").dataset.attribute =
      currentList[studentIndex].id;

    modal
      .querySelector("[data-action=expel]")
      .addEventListener("click", expelStudent);
  }

  //my picture
  if (currentList[studentIndex].firstname === "Miary") {
    modal.querySelector(".pic").src = "images/me.png";
  } else {
    const studentPic =
      "images/" +
      currentList[studentIndex].lastname.toLowerCase() +
      "_" +
      currentList[studentIndex].firstname.charAt(0).toLowerCase() +
      ".png";
    if (studentPic != undefined) {
      modal.querySelector(".pic").src = studentPic;
    }
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
  document
    .querySelector(".modal")
    .querySelector("article").dataset.theme = housename.toLowerCase();
  document.querySelector(".modal").querySelector(".crest").src =
    "crest/" + housename.toLowerCase() + ".png";
}

/******************EXPELLING************************/
function expelStudent(event) {
  const id = event.target.dataset.attribute;

  const indexStudent = currentList.findIndex(studentID);

  //I'm un-expelable
  if (currentList[indexStudent].firstname === "Miary") {
    currentList[indexStudent].expelled = false;
    document.querySelector(".un-expellable").style.display = "block";
    setTimeout(function() {
      document.querySelector(".un-expellable").style.display = "none";
    }, 4000);
  } else {
    //AND CLOSE THE MODAL **********SOME ANIMATION HERE TOO*********
    window.removeEventListener("scroll", noScroll);
    document.querySelector(".modal").classList.remove("showModal");
    document.querySelector(".main").classList.remove("moveMain");
    document.querySelector("#menuMobile").classList.remove("moveMain");
    document.querySelector(".tableHeader").classList.remove("moveList");
    list.classList.remove("moveList");

    //mark student as expelled
    currentList[indexStudent].expelled = true;

    //add student to expelled list
    expelledList.push(currentList[indexStudent]);

    //delete it from both lists
    currentList.splice(indexStudent, 1);

    const indexStudent2 = allStudents.findIndex(studentID);
    allStudents.splice(indexStudent2, 1);
    nonExpelledList = allStudents;
    //remove it from display
    const element = list.querySelector(
      '.student button[data-attribute="' + id + '"]'
    );

    element.parentElement.remove();
    console.log(currentList);
  }

  function studentID(student) {
    if (student.id === id) {
      return true;
    } else {
      return false;
    }
  }

  //update student count
  countStudents(currentList, nonExpelledList);
}

/************PREFECT***************************/
function managePrefect(event) {
  const checkbox = event.target;
  const id = checkbox.dataset.attribute;

  const indexStudent = nonExpelledList.findIndex(studentID);

  function studentID(student) {
    if (student.id === id) {
      return true;
    } else {
      return false;
    }
  }

  //store all checkbox in array
  let allCheckox = Array.from(
    list.querySelectorAll("input[data-action=prefect]")
  );

  let count = 0;
  allCheckox.forEach(makePrefect);

  function makePrefect(checkbox) {
    if (checkbox.checked) {
      nonExpelledList[indexStudent].prefect = true;
      console.log(nonExpelledList[indexStudent]);
    }
  }

  count = filterPrefects(nonExpelledList[indexStudent].house);

  console.log("Count:" + count);

  if (count > 2) {
    checkbox.checked = false;
    //count--;
    alert(
      "More than 2 prefects selected in house " +
        nonExpelledList[indexStudent].house
    );
    nonExpelledList[indexStudent].prefect = false;
  }
}

//Number of prefect in a house
function filterPrefects(house) {
  let counter = 0;

  nonExpelledList.filter(student => {
    if (student.house === house && student.prefect === true) {
      counter++;
    }
  });

  console.log("Counter: " + counter);
  return counter;
}

/**************INQUISITORIAL SQUAD*********************/
function manageSquad(event) {
  const checkbox = event.target;
  const id = checkbox.dataset.attribute;

  const indexStudent = nonExpelledList.findIndex(studentID);

  function studentID(student) {
    if (student.id === id) {
      return true;
    } else {
      return false;
    }
  }

  if (
    nonExpelledList[indexStudent].blood == "Pure blood" ||
    nonExpelledList[indexStudent].house == "Slytherin"
  ) {
    nonExpelledList[indexStudent].inquisitorial = true;
  } else {
    nonExpelledList[indexStudent].inquisitorial = false;
    checkbox.checked = false;
    alert(
      "This student cannot be in the inquisitorial squad. Choose a pure blood or one from Slytherin"
    );
  }

  //hacking: remove inquisitorial status after 1.5sec
  setTimeout(function() {
    checkbox.checked = false;
    nonExpelledList[indexStudent].inquisitorial = false;
  }, 1500);
}

//disable window scrolling when modal is open
//https://davidwells.io/snippets/disable-scrolling-with-javascript
function noScroll() {
  window.scrollTo(0, 0);
}

//generate uuid: unique id
//https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function createUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
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
