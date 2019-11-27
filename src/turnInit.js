import { clickListener } from "./clickListener";
import { typewriterInit, sFix } from "./anim"

export function turnInit(uParty, cParty){
    let window = document.querySelector('.window');
    let textbox = document.querySelector('.textbox');

    let uCurPkmn = uParty[0];
    let cCurPkmn = cParty[0];

    console.log(uParty, cParty);
    window.innerHTML = `<img class='userSprite' src="${uCurPkmn.sprite.back}"></img><img class='compSprite' src="${cCurPkmn.sprite.front}"></img><div class="battle_button_cont"> <button class="turn_button btn" value="0">Attack</button><button class="turn_button btn" value="1">Items</button><button class="turn_button btn" value="2">Pokemon</button> </div>`;

    clickListener('.turn_button', ((e) => {
        let selection = e.target.value;
        let buttonCont = document.querySelector('.battle_button_cont');
        document.querySelector('.battle_button_cont').innerHTML = ''
        switch(selection){
            case '0':
                uCurPkmn.moves.forEach((el, i) => {
                    buttonCont.insertAdjacentHTML('beforeend', `<button class="attack_button btn" value="${i}">${sFix(el.name)}</button>`);
                });
                clickListener('.attack_button', (at) => {
                    let uAttack = uCurPkmn.moves[at.target.value];
                    let cAttack = cCurPkmn.moves[Math.round(Math.random()*4)];
                    let messege;
                    function damageCalc(atTy, curAttacker, curDefender, attack){
                        let atk, def;
                        switch(atTy){
                            case 'atk':
                                atk = curAttacker.atk;
                                def = curDefender.def;
                                break;
                            case 'sAtk':
                                atk = curAttacker.sAtk;
                                def = curDefender.sDef;
                        }
                        messege = `${sFix(curAttacker.name)} used ${sFix(attack.name)}. `;
                        let rand = (Math.random() * .25) + .85;
                        let type = 1;
                        let stab = 1;
                        let crit = 1;
                        (function(){
                            let defWeakness = curDefender.types.map(el => el.damage_relations.double_damage_from).map(el => el.map(na => na.name));
                            let defResistance = curDefender.types.map(el => el.damage_relations.half_damage_from).map(el => el.map(na => na.name));
                            defWeakness.forEach((el) => {
                                if(el.includes(attack.type.name) == true){
                                    type = type * 2;
                                };
                            });
                            defResistance.forEach((el) => {
                                if(el.includes(attack.type.name) == true ){
                                    type = .5;
                                }
                            });
                            if(type > 1){
                                messege += `It was super effective!`;
                            }
                            if(type < 1){
                                messege += `It was not very effective...`;
                            }
                        })();
                        (function(){
                            if(curAttacker.types.includes(attack.type.name)){
                                stab = 1.5;
                            }
                        })();
                        (function(){
                            let critChance = Math.random() * curAttacker.speed / 512;
                            if(critChance == 1){
                                crit = 1.5;
                                messege = messege + `It was a critical hit!`
                            }
                        })();
                        let multiplier = rand * type * stab * crit;
                        let damage = (((12 * attack.power * (atk / def)) / 50) + 2) * multiplier;
                        curDefender.curHP -= damage;
                    }

                    function statRes(curAttacker, curDefender, attack){
                        messege = `${sFix(curAttacker.name)} used ${sFix(attack.name)}. `;
                        switch(attack.target.name){
                            case 'user':
                                move.stat_changes.forEach((el) => {
                                    switch(el.stat.name){
                                        case 'attack':
                                            curAttacker.atk *= (1 + (el.change * .5));
                                            messege += `It's attack rose! `;
                                            break;
                                        case 'defense':
                                            curAttacker.def *= (1 + (el.change * .5));
                                            messege += `It's defense rose! `;
                                            break;
                                        case 'special-attack':
                                            curAttacker.sAtk *= (1 + (el.change * .5));
                                            messege += `It's special attack rose! `;
                                            break;
                                        case 'special-defense':
                                            curAttacker.sDef *= (1 + (el.change * .5));
                                            messege += `It's special defense rose! `;
                                            break;
                                        case 'speed':
                                            curAttacker.speed *= (1 + (el.change * .5));
                                            messege += `It's speed rose! `
                                            break;
                                        default:
                                            messege += `But it failed... `;
                                    }
                                });
                                break;
                            case 'all-opponents' || 'selected-pokemon':
                                attack.stat_changes.forEach((el) => {
                                    switch(el.stat.name){
                                        case 'attack':
                                            curDefender.atk *= (1 + (el.change * (1/3)));
                                            messege += `${sFix(curDefender.name)}'s attack fell! `;
                                            break;
                                        case 'defense':
                                            curDefender.def *= (1 + (el.change * (1/3)));
                                            messege += `${sFix(curDefender.name)}'s defense fell! `;
                                            break;
                                        case 'special-attack':
                                            curDefender.sAtk *= (1 + (el.change * (1/3)));
                                            messege += `${sFix(curDefender.name)}'s special attack fell! `;
                                            break;
                                        case 'special-defense':
                                            curDefender.sDef *= (1 + (el.change * (1/3)));
                                            messege += `${sFix(curDefender.name)}'s special defense fell! `;
                                            break;
                                        case 'speed':
                                            curDefender.speed *= (1 + (el.change * (1/3)));
                                            messege += `${sFix(curDefender.name)}'s speed fell! `;
                                            break;
                                        default:
                                            messege += `But it failed... `;
                                    }
                                });
                                break;
                            default:
                                alert('statRes defaulting, check logs.');
                        }
                    }
                    //uTurnRes
                    if(uAttack.damage_class.name == 'physical'){
                        damageCalc('atk', uCurPkmn, cCurPkmn, uAttack);
                    }else if(uAttack.damage_class.name == 'special'){
                        damageCalc('sAtk', uCurPkmn, cCurPkmn, uAttack);
                    }else if(uAttack.damage_class.name == 'status'){
                        if(uAttack.stat_changes.length != 0){
                            statRes(uCurPkmn, cCurPkmn, uAttack);
                        }else{
                            messege = `${uCurPkmn.name} used ${attack.name}, but it failed!`;
                        }
                    }
                    
                    messege = sFix(messege);
                    typewriterInit(document.querySelector('.textbox_text'), messege);
                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_attack_next"> [Next] </span>';

                    clickListener('.textbox_attack_next', (() => {
                        //cTurnRes
                    if(cAttack.damage_class.name == 'physical'){
                        damageCalc('atk', cCurPkmn, uCurPkmn, cAttack);
                    }else if(cAttack.damage_class.name == 'special'){
                        damageCalc('sAtk', cCurPkmn, uCurPkmn, cAttack);
                    }else if(cAttack.damage_class.name == 'status'){
                        if(cAttack.stat_changes.length != 0){
                            statRes(cCurPkmn, uCurPkmn, cAttack);
                        }else{
                            messege = `${uCurPkmn.name} used ${attack.name}, but it failed!`;
                        }
                    }
                    messege = sFix(messege);
                    typewriterInit(document.querySelector('.textbox_text'), messege);
                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_attack_next"> [Next] </span>';
                    console.log(uCurPkmn.HP, uCurPkmn.curHP, cCurPkmn.HP, cCurPkmn.curHP);
                    }));
                });
                break;
            case '1':
                break;
            case '2':
                break;
            default:
                alert('Defaulting. Check logs.');
        }
    }))
}