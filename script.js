const baseLink = "http://petlatkea.dk/2019/students1991.json";
const template = document.querySelector("template").content;
const list = document.querySelector(".list");

//array to put all students name
const arrStud = [];
const arrHouse = [];

window.addEventListener("load", showList);

function showList() {
    //fetching elements and displaying w/ function display
    fetch(baseLink).then(e => e.json()).then(data => data.forEach(display));

    function display(oneStudent) {
        const myClone = template.cloneNode(true);

        myClone.querySelector("h1").textContent = oneStudent.fullname;
        myClone.querySelector("p").textContent = oneStudent.house;

        list.appendChild(myClone);
    }
}

//create sort btn
const sortBtn = document.querySelector(".sortBy");
const sortMenu = document.querySelector(".sortOpt");

sortBtn.addEventListener("click", showSortOpt);

function showSortOpt() {
    sortMenu.classList.toggle("show");
}

//create filter btn
const filterBtn = document.querySelector(".filterBy");
const filterMenu = document.querySelector(".filterOpt");

filterBtn.addEventListener("click", showFilterOpt);

function showFilterOpt() {
    filterMenu.classList.toggle("show");
}

//reset all the .list content (studnet list displayed)
//found on https://www.geeksforgeeks.org/remove-all-the-child-elements-of-a-dom-node-in-javascript/
function deleteChild() {
    const parent = document.querySelector(".list");
    let child = parent.lastElementChild;

    //whilw there is child inside this div .list
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

//function sort by firt name
const sortFirstBtn = document.querySelector("#sortFirst");

sortFirstBtn.addEventListener("click", sortFirstList);

function sortFirstList() {

    fetch(baseLink).then(e => e.json()).then(data => sortFirstName(data));

    function sortFirstName(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting all names (first and last) inside an array
            arrStud.push(oneStudent.fullname);

            //sort the array
            arrStud.sort();

        });

        console.log(arrStud);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < arrStud.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = arrStud[i];

            list.appendChild(myClone);
            console.log(arrStud[i]);
        }
    }

}

//function sort by last name

//function sort by house
const sortHouseBtn = document.querySelector("#sortHouse");
const arrHuffle = [];
const arrGryff = [];
const arrSly = [];
const arrRav = [];
let allHouses = [];
let houseName = [];
let houseGryff = [];
let houseHuffle = [];
let houseSly = [];
let houseRav = [];

sortHouseBtn.addEventListener("click", sortHouseList);

function sortHouseList() {

    fetch(baseLink).then(e => e.json()).then(data => sortHouse(data));

    function sortHouse(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting each student inside correspondant house
            //synchronizing house name array with student name array
            if (oneStudent.house == "Gryffindor") {
                arrGryff.push(oneStudent.fullname);
                houseGryff.push(oneStudent.house);
            } else if (oneStudent.house == "Hufflepuff") {
                arrHuffle.push(oneStudent.fullname);
                houseHuffle.push(oneStudent.house);
            } else if (oneStudent.house == "Slytherin") {
                arrSly.push(oneStudent.fullname);
                houseSly.push(oneStudent.house);
            } else {
                arrRav.push(oneStudent.fullname);
                houseRav.push(oneStudent.house);
            }

        });

        //put all arrays into ONE
        allHouses = arrGryff.concat(arrHuffle, arrSly, arrRav);
        console.log(allHouses);
        houseName = houseGryff.concat(houseHuffle, houseSly, houseRav);
        console.log(houseName);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < allHouses.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = allHouses[i];
            myClone.querySelector("p").textContent = houseName[i];

            list.appendChild(myClone);
        }
    }

}