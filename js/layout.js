const inputs = document.querySelectorAll('input[type=radio]');
let selectedOutput = 'alg2';

inputs.forEach(e=>{
	e.addEventListener('change', event=>{
        let active = document.querySelector('label.active');
        if (active) active.classList.remove('active');
        event.target.parentElement.classList.add('active');
        selectedOutput = event.target.value;
        drawResult();
  });
});