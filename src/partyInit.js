import { get } from './apiCall'
import { clickListener } from './clickListener';
import { turnInit } from './turnInit';

let typeData;
(async() => {
    typeData = await get.type();
})()

class PKMN{
    constructor(pkmn){
        this.name = pkmn.name;
        this.types = typeData.filter(
            (el) => {
                let ty = pkmn.types.map(i => i.type.name);
                //console.log(el.name, ty)
                if(ty.includes(el.name)){
                    return el;
                };
            }
        );
        [this.speed, this.sDef, this.sAtk, this.def, this.atk, this.HP] = pkmn.stats.map(el => el.base_stat);
        this.moves = pkmn.moves.map(el => el.move.name);
        this.sprite = {
            front: pkmn.sprites.front_default,
            back: pkmn.sprites.back_default
        }
        this.curHP = this.HP;
    }
}

async function resolveMoveSet(curPkmn, moveSet){
    moveSet = moveSet.map(async (el) => {
        let move = await get.move(el);
        return move;
    });
    curPkmn.moves = [];
    moveSet.forEach((el) => {
        Promise.resolve(el).then(function(value){
            curPkmn.moves.push(value);
        });
    });    
}

function moveInit(uParty, cParty){
    let i = 0
    let form = document.querySelector(".window");
    function moveDropdown(curPkmn){
        form.innerHTML =  '<div class="move_init_select_cont"><select class="move_init_select"></select><select class="move_init_select"></select><select class="move_init_select"></select><select class="move_init_select"></select></div><div class="move_init_button_cont"><button class="move_init_button btn">Continue</button></div>';
        document.querySelectorAll('.move_init_select').forEach((el) => {
            curPkmn.moves.forEach((curMove) => {
                el.insertAdjacentHTML('beforeend', `<option value='${curMove}'>${curMove}</option>`)
            });
        });
        clickListener('.move_init_button', () => {
            let moveSet = [];
            let cMoveSet = [];
            document.querySelectorAll('.move_init_select').forEach((el) => {
                moveSet.push(el.value);
            });
            while(cMoveSet.length < 4){
                cMoveSet.push(cParty[i].moves[Math.round(Math.random()*cParty[i].moves.length)]);
            }
            resolveMoveSet(uParty[i], moveSet);
            resolveMoveSet(cParty[i], cMoveSet);
            i = i+1;
            if(i == (uParty.length)){
                turnInit(uParty, cParty);
            }else{
                moveDropdown(uParty[i]);
            }
        });
    }
    moveDropdown(uParty[i]);
}

export async function partyInit(uParty, cParty){
    uParty = uParty.map(el => new PKMN(el));
    cParty = cParty.map(el => new PKMN(el));
    moveInit(uParty, cParty); //Combinded into one since data could not keep up with demand if more than two move sets are instanciated at once
    //clickListener('.init_complete', turnInit(uParty, cParty));
}