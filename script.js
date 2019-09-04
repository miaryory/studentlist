const baseLink = "http://petlatkea.dk/2019/students1991.json";
const template = document.querySelector("template").content;
const list = document.querySelector("main");

//fetching elements and displaying w/ function display
fetch(baseLink).then(e => e.json()).then(data => data.forEach(display));

function display(oneStudent) {
    const myClone = template.cloneNode(true);

    myClone.querySelector("h1").textContent = oneStudent.fullname;
    myClone.querySelector("p").textContent = oneStudent.house;

    list.appendChild(myClone);
}