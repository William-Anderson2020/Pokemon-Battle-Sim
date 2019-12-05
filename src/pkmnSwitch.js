import { typewriterInit, sFix } from "./anim";
import { clickListener } from "./clickListener";

/* export function pkmnSwitch(curPkmn, curParty){
    let bCont = document.querySelector('.battle_button_cont');
    let textBox = document.querySelector('.textbox_text');
    let nextBox = document.querySelector('.textbox_next');
    nextBox.innerHTML = '';
    curParty.forEach(el => {
        console.log(el.curHP);
        let bString = `<button class="pkmn_switch_button %active% " value="${curParty.indexOf(el)}"> <img src=${el.sprite.front}> ${sFix(el.name)} ${el.curHP}/${el.HP}</button>`
        if(el.curHP <= 0){
            bString = bString.replace('%active%', 'pkmn_switch_button_inactive');
        }else{
            bString = bString.replace('%active%', 'pkmn_switch_button_active');
        }
        bCont.insertAdjacentHTML("beforeend", bString);
    })
    clickListener('.pkmn_switch_button_inactive', (el) => {
        let pkmn = curParty[el.target.value];
        typewriterInit(textBox, (`${sFix(pkmn.name)} is unable to fight.`));
    })
} */

function pkmnSwitch(curPkmn, curParty){
    document.querySelector('.battle_button_cont').innerHTML = `<div class="switch_button_cont"></div><div class="select_switch_cont"><div class="select_back select_switch"><</div><div class="select_next select_switch">></div></div>`;
    let textBox = document.querySelector('.textbox_text');
    let nextBox = document.querySelector('.textbox_next');
    let bCont = document.querySelector('.switch_button_cont');
    let bArray = [];
    nextBox.innerHTML = '';
    curParty.forEach(el => {
        console.log(el.curHP);
        let bString = `<button class="pkmn_switch_button %active% " value="${curParty.indexOf(el)}"> <img src=${el.sprite.front}> ${sFix(el.name)} ${el.curHP}/${el.HP}</button>`
        if(el.curHP <= 0){
            bString = bString.replace('%active%', 'pkmn_switch_button_inactive');
        }else{
            bString = bString.replace('%active%', 'pkmn_switch_button_active');
        }
        bArray.push(bString);
    })
    let count = 0;
    let countCap = (bArray.length - 1)

    function changeDisp(){
        if(count > countCap){
            count = 0;
        }else if(count < 0){
            count = countCap;
        }
        bCont.innerHTML = bArray[count];
        clickListener('.pkmn_switch_button_inactive', (el) => {
            let pkmn = curParty[el.target.value];
            typewriterInit(textBox, (`${sFix(pkmn.name)} is unable to fight.`));
        })
    }
    changeDisp();

    clickListener('.select_back', () => {
        count--;
        changeDisp();
    })

    clickListener('.select_next', () => {
        count++;
        changeDisp();
    })

    clickListener('.pkmn_switch_button_inactive', (el) => {
        let pkmn = curParty[el.target.value];
        typewriterInit(textBox, (`${sFix(pkmn.name)} is unable to fight.`));
    })
}