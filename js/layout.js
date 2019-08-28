const body = document.querySelector('body');
let inputActive = true;
const deactivate = () => {
    body.querySelector('.active').classList.remove('active');
    inputActive = !inputActive;
};
const swapDOM = (percent) => {
    if (inputActive && percent > 0.7) {
        deactivate();
        body.querySelector('.output').classList.add('active');
    }
    if (!inputActive && percent < 0.3) {
        deactivate();
        body.querySelector('.input').classList.add('active');
    }
}

body.addEventListener('click',e=>swapDOM(e.clientY / body.clientHeight));