window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

const icon = document.getElementById('icon');
const dropdown = document.getElementsByClassName('links');

document.getElementById('icon').addEventListener('click', (e) => {
	document.getElementById('links').classList.toggle('menu-down');
	document.getElementById('nav-icon').classList.toggle('fa-times');
});

});