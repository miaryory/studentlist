const baseLink = "http://petlatkea.dk/2019/students1991.json";
const template = document.querySelector("template").content;
const list = document.querySelector(".list");


//MODAL
const modal = document.querySelector(".modal");
const modalCross = document.querySelector(".modal#cross");

modal.style.display = "none";

//array to put all students name
//const arrStud = [];
const arrHouse = [];

window.addEventListener("load", showList);

function showList() {
    //fetching elements and displaying w/ function display
    fetch(baseLink).then(e => e.json()).then(data => data.forEach(display));
    deleteChild()

    function display(oneStudent) {
        const myClone = template.cloneNode(true);

        myClone.querySelector("h1").textContent = oneStudent.fullname;
        myClone.querySelector("p").textContent = oneStudent.house;
        myClone.querySelector("button").addEventListener("click", showDetails);

        list.appendChild(myClone);
    }
}

//show details in modal----UNDONE
function showDetails() {
    modal.styel.display = "block";
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

//function sort by None
const sortNoneBtn = document.querySelector("#sortNone");

sortNoneBtn.addEventListener("click", showList);

//function sort by firt name
const sortFirstBtn = document.querySelector("#sortFirst");

sortFirstBtn.addEventListener("click", sortFirstList);

function sortFirstList() {
    const arrStud = [];

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

//function sort by house
const sortHouseBtn = document.querySelector("#sortHouse");


sortHouseBtn.addEventListener("click", sortHouseList);

function sortHouseList() {

    const arrHuffle = [];
    const arrGryff = [];
    const arrSly = [];
    const arrRav = [];
    let allHouses = [];
    let houseName = [];
    const houseGryff = [];
    const houseHuffle = [];
    const houseSly = [];
    const houseRav = [];

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

//function sort by last name

//function filter: All
const filterAllBtn = document.querySelector("#filterAll");
filterAllBtn.addEventListener("click", sortHouseList);

//function filter: Gryffindor
const filterGryffBtn = document.querySelector("#filterGryff");


filterGryffBtn.addEventListener("click", gryffOnlyList);

function gryffOnlyList() {

    const gryffOnlyStud = [];

    fetch(baseLink).then(e => e.json()).then(data => filterGryffOnly(data));

    function filterGryffOnly(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting each student belonging to Gryffindor in 1 array
            if (oneStudent.house == "Gryffindor") {
                gryffOnlyStud.push(oneStudent.fullname);
            }

        });

        console.log(gryffOnlyStud);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < gryffOnlyStud.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = gryffOnlyStud[i];
            myClone.querySelector("p").textContent = "Gryffindor";

            list.appendChild(myClone);
        }
    }

}

//function filter: Hufflepuff
const filterHuffBtn = document.querySelector("#filterHuff");


filterHuffBtn.addEventListener("click", huffOnlyList);

function huffOnlyList() {

    const huffOnlyStud = [];

    fetch(baseLink).then(e => e.json()).then(data => filterHuffOnly(data));

    function filterHuffOnly(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting each student belonging to Gryffindor in 1 array
            if (oneStudent.house == "Hufflepuff") {
                huffOnlyStud.push(oneStudent.fullname);
            }

        });

        console.log(huffOnlyStud);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < huffOnlyStud.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = huffOnlyStud[i];
            myClone.querySelector("p").textContent = "Hufflepuff";

            list.appendChild(myClone);
        }
    }

}

//function filter: Slytherin
const filterSlyBtn = document.querySelector("#filterSlyth");


filterSlyBtn.addEventListener("click", slyOnlyList);

function slyOnlyList() {

    const slyOnlyStud = [];

    fetch(baseLink).then(e => e.json()).then(data => filterSlyOnly(data));

    function filterSlyOnly(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting each student belonging to Gryffindor in 1 array
            if (oneStudent.house == "Slytherin") {
                slyOnlyStud.push(oneStudent.fullname);
            }

        });

        console.log(slyOnlyStud);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < slyOnlyStud.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = slyOnlyStud[i];
            myClone.querySelector("p").textContent = "Slytherin";

            list.appendChild(myClone);
        }
    }

}

//function filter: Ravenlaw
const filterRavBtn = document.querySelector("#filterRav");

filterRavBtn.addEventListener("click", ravOnlyList);

function ravOnlyList() {

    const ravOnlyStud = [];

    fetch(baseLink).then(e => e.json()).then(data => filterRavOnly(data));

    function filterRavOnly(allStudent) {

        allStudent.forEach(oneStudent => {

            //putting each student belonging to Gryffindor in 1 array
            if (oneStudent.house == "Ravenclaw") {
                ravOnlyStud.push(oneStudent.fullname);
            }

        });

        console.log(ravOnlyStud);

        //move content from the array to the html studentName
        //first: reset the previous list w/ this function
        deleteChild();

        //assign each element inside the array and create new list
        for (let i = 0; i < ravOnlyStud.length; i++) {
            const myClone = template.cloneNode(true);

            myClone.querySelector("h1").textContent = ravOnlyStud[i];
            myClone.querySelector("p").textContent = "Ravenclaw";

            list.appendChild(myClone);
        }
    }

}