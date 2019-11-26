export function animInit() {
    document.querySelectorAll('.trivia_answer_choice').forEach(el => {
        el.addEventListener('mouseover', el => {
            el.target.style.transform = 'scale(1.1, 1.1)';
            el.target.style.transition = '.5s';
        });
    });
    document.querySelectorAll('.trivia_answer_choice').forEach(el => {
        el.addEventListener('mouseout', el => {
            el.target.style.transform = 'scale(1, 1)';
            el.target.style.transition = '.5s';
        });
    });
}

export function typewriterInit(el, txt) {
    let i = 0;
    let speed = 50;
    el.innerHTML = '';
    function typeWriter(){
    if (i < txt.length) {
        el.innerHTML = el.innerHTML + txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
    }
    typeWriter();
}  

export function typeDelay(delay){
    let i = 0
    function delay(){
    if(i<delay){
        setTimeout( () => {i++}, 1000);
    }
    }
}

export function ansSelect(el, color){
    el.style.backgroundColor = color;
    el.style.transition= '.5s all';
    window.setTimeout(() => {
        el.style.backgroundColor = 'rgba(0,0,0,.9)'
        el.style.color = 'white'
    }, 500)
}