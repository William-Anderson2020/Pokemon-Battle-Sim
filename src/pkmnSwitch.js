import { typewriterInit, sFix } from "./anim";
import { clickListener } from "./clickListener";

export function pkmnSwitch(curPkmn, curParty){
    let bCont = document.querySelector('.battle_button_cont');
    let textBox = document.querySelector('.textbox_text');
    let nextBox = document.querySelector('.textbox_next');
    nextBox.innerHTML = '';
    curParty.forEach(el => {
        console.log(el.curHP);
        let bString = `<button class="pkmn_switch_button %active% " value="${curParty.indexOf(el)}"> <img src=${el.sprite.front}> ${sFix(el.name)}</button>`
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
}