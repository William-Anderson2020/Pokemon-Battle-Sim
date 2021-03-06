export function typewriterInit(el, txt) {
    let i = 0;
    let speed = 20;
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

export function sFix(text){ //semantic fix
    text = text.charAt(0).toUpperCase() + text.slice(1).replace('-', ' ');
    return text;
}

export function barCheck(target, curPkmn){
    let hpFrac = curPkmn.curHP / curPkmn.HP;
    let color, el;

    if(target == 'u'){
        el = document.querySelector('.uHPBarFill');
    }else{
        el = document.querySelector('.cHPBarFill');
    }

    if(hpFrac >= .5){
        color = 'green';
    }else if(hpFrac >= .25){
        color = '#FFDE00';
    }else{
        color = '#CC0000';
    }
    
    el.style.backgroundColor = color;
}

export function userAtk(){
    document.querySelector('.userSprite').classList.add('userSpriteAtk');
    setTimeout(function(){document.querySelector('.userSprite').classList.remove('userSpriteAtk')}, 1000)
}

export function compAtk(){
    document.querySelector('.compSprite').classList.add('compSpriteAtk');
    setTimeout(function(){document.querySelector('.compSprite').classList.remove('compSpriteAtk')}, 1000)
}

export function userRecoil(){
    document.querySelector('.userSprite').classList.add('userSpriteRecoil');
    setTimeout(function(){document.querySelector('.userSprite').classList.remove('userSpriteRecoil')}, 1000)
}

export function compRecoil(){
    document.querySelector('.compSprite').classList.add('compSpriteRecoil');
    setTimeout(function(){document.querySelector('.compSprite').classList.remove('compSpriteRecoil')}, 1000)
}