import { clickListener } from "./clickListener";
import { typewriterInit, sFix, barCheck } from "./anim"
import { pkmnSwitch } from "./pkmnSwitch";

export function turnInit(uParty, cParty){
    let window = document.querySelector('.window');

    let uCurPkmn = uParty[0];
    let cCurPkmn = cParty[0];

    console.log(uParty, cParty);
    window.innerHTML = `<div class="battle_cont"><div class="disp cDisp"> <div class="name, cPkmnName"></div> <div class="cHPBar HPBar"> <div class="cHPBarFill HPBarFill"></div> </div> </div><div class="battle_sprite_cont"><img class='userSprite' src="${uCurPkmn.sprite.back}"></img><img class='compSprite' src="${cCurPkmn.sprite.front}"></div> <div class="disp uDisp"> <div class="name, uPkmnName"></div> <div class="uHPBar HPBar"> <div class="uHPBarFill HPBarFill"></div> </div> </div>  </div> <div class="textbox"> <div class="textbox_text"></div> <div class="textbox_next"></div> </div> <div class="battle_button_cont"> <button class="turn_button btn" value="0">Attack</button><button class="turn_button btn" value="1">Items</button><button class="turn_button btn" value="2">Pokemon</button> </div>`;

    function buttonInit(){
        document.querySelector('.battle_button_cont').innerHTML = '<button class="turn_button btn" value="0">Attack</button><button class="turn_button btn" value="1">Items</button><button class="turn_button btn" value="2">Pokemon</button>'
    
        document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
        document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);

        document.querySelector('.textbox_text').innerHTML = '';
        document.querySelector('.textbox_next').innerHTML = '';
        
        let hpBarWidth = document.querySelector('.HPBar').getBoundingClientRect().width - 8;
        let messege;

        function turnRes(curAttacker, curDefender, curAttack, target){
            if(curAttack == undefined){
                messege = `${sFix(curAttacker.name)} flailed about.`
            }else{
                let dmgClass = curAttack.damage_class.name;
                if(dmgClass == 'physical'){
                    damageCalc('atk', curAttacker, curDefender, curAttack);
                }else if(dmgClass == 'special'){
                    damageCalc('sAtk', curAttacker, curDefender, curAttack);
                }else if(dmgClass == 'status'){
                    if(curAttack.name == 'transform'){
                        uCurPkmn = cCurPkmn;
                        document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                        document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                        document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                        messege = `Ditto transformed into ${sFix(uCurPkmn.name)}!`;
                    }else if(curAttack.stat_changes.length != 0){
                        statRes(curAttacker, curDefender, curAttack);
                    }else{
                        messege = `${sFix(curAttacker.name)} used ${sFix(curAttack.name)}, but it failed!`;
                    }
                }
            }
            let hpBar;
            let hpRatio = (curDefender.curHP / curDefender.HP);
            if(curDefender.curHP <= 0){
                hpRatio = 0;
            }
            let width;
            if(target == 'c'){
                hpBar = document.querySelector('.cHPBarFill');
                barCheck('c', cCurPkmn);
            }else{
                hpBar = document.querySelector('.uHPBarFill');
                barCheck('u', uCurPkmn);
            }
            width = hpBar.getBoundingClientRect().width * hpRatio;
            hpBar.style.setProperty('width', width);
            messege = sFix(messege);
            typewriterInit(document.querySelector('.textbox_text'), messege);
            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_attack_next"> [Next] </span>';
        }

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
                    attack.stat_changes.forEach((el) => {
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
                                break;
                        }
                    });
                    break;
                case 'all-opponents':
                    attack.stat_changes.forEach((el) => {
                        switch(el.stat.name){
                            case 'attack':
                                curDefender.atk *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s attack fell! `;
                                break;
                            case 'defense':
                                curDefender.def *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s defense fell! `;
                                break;
                            case 'special-attack':
                                curDefender.sAtk *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s special attack fell! `;
                                break;
                            case 'special-defense':
                                curDefender.sDef *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s special defense fell! `;
                                break;
                            case 'speed':
                                curDefender.speed *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s speed fell! `;
                                break;
                            default:
                                messege += `But it failed... `;
                                break;
                        }
                    });
                    break;
                    case 'selected-pokemon':
                    attack.stat_changes.forEach((el) => {
                        switch(el.stat.name){
                            case 'attack':
                                curDefender.atk *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s attack fell! `;
                                break;
                            case 'defense':
                                curDefender.def *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s defense fell! `;
                                break;
                            case 'special-attack':
                                curDefender.sAtk *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s special attack fell! `;
                                break;
                            case 'special-defense':
                                curDefender.sDef *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s special defense fell! `;
                                break;
                            case 'speed':
                                curDefender.speed *= (1 - (el.change * (1/3)));
                                messege += `${sFix(curDefender.name)}'s speed fell! `;
                                break;
                            default:
                                messege += `But it failed... `;
                                break;
                        }
                    });
                    break;
                default:
                    alert('statRes defaulting, check logs.');
                    break;
            }
        }
        
        clickListener('.turn_button', (function(e){
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
                        let cAttack = cCurPkmn.moves[Math.round(Math.random()*(cCurPkmn.moves.length-1))];
                        let messege;
                        document.querySelector('.battle_button_cont').innerHTML = '';

                        if(uCurPkmn.speed >= cCurPkmn.speed){
                            turnRes(uCurPkmn, cCurPkmn, uAttack, 'c');
                            clickListener('.textbox_attack_next', () => {
                                if(cCurPkmn.curHP <= 0){
                                    typewriterInit(document.querySelector('.textbox_text'), `The opposing ${cCurPkmn.name} has fainted!`);
                                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_fainted"> [Next] </span>';
                                    clickListener('.textbox_opponent_fainted', () => {
                                        if(cParty.indexOf(cCurPkmn) == (cParty.length - 1)){
                                            typewriterInit(document.querySelector('.textbox_text'), `Your oppoent is out of useable pokemon. You win!`);
                                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_game_end"> [Next] </span>';
                                        }else{
                                            cCurPkmn = cParty[cParty.indexOf(cCurPkmn)+1];
                                            document.querySelector('.compSprite').src = cCurPkmn.sprite.front;
                                            document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
                                            typewriterInit(document.querySelector('.textbox_text'), `Your opponent sent out ${sFix(cCurPkmn.name)}.`);
                                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_next_pokemon"> [Next] </span>';
                                            document.querySelector('.cHPBarFill').style.setProperty('width', hpBarWidth* (cCurPkmn.curHP / cCurPkmn.HP));
                                            clickListener('.textbox_opponent_next_pokemon', buttonInit);
                                        }
                                    });
                                }else{
                                    turnRes(cCurPkmn, uCurPkmn, cAttack, 'u');
                                    clickListener('.textbox_attack_next', () => {
                                        if(uCurPkmn.curHP <= 0){
                                            let uHp = uParty.map(pk => pk.curHP > 0);
                                            console.log(uHp);
                                            if(uHp.includes(true) == false){
                                                typewriterInit(document.querySelector('.textbox_text'), `You are out of useable Pokemon... Game Over.`);
                                                document.querySelector('.textbox_next').innerHTML = '<span class="textbox_game_end"> [Next] </span>';
                                            }else{
                                                typewriterInit(document.querySelector('.textbox_text'), (`${sFix(uCurPkmn.name)} has fainted. Choose your next Pokemon.`));
                                                pkmnSwitch(uCurPkmn, uParty);
                                                clickListener('.pkmn_switch_button_active', (el) => {
                                                    let choice = el.target.value;
                                                    uCurPkmn = uParty[choice];
                                                    document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                                                    document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                                                    document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                                                    buttonInit();
                                                });
                                            }
                                        }else{
                                            buttonInit();
                                        }
                                    });
                                }
                            })
                        }else{
                            turnRes(cCurPkmn, uCurPkmn, cAttack, 'u');
                            clickListener('.textbox_attack_next', () => {
                                if(uCurPkmn.curHP <= 0){
                                    let uHp = uParty.map(pk => pk.curHP > 0);
                                    console.log(uHp);
                                    if(uHp.includes(true) == false){
                                        typewriterInit(document.querySelector('.textbox_text'), `You are out of useable Pokemon... Game Over.`);
                                        document.querySelector('.textbox_next').innerHTML = '<span class="textbox_game_end"> [Next] </span>';
                                    }else{
                                        typewriterInit(document.querySelector('.textbox_text'), (`${sFix(uCurPkmn.name)} has fainted. Choose your next Pokemon.`));
                                        pkmnSwitch(uCurPkmn, uParty);
                                        clickListener('.pkmn_switch_button_active', (el) => {
                                            let choice = el.target.value;
                                            uCurPkmn = uParty[choice];
                                            document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                                            document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                                            document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                                            buttonInit();
                                        });
                                    }
                                }else{
                                    turnRes(uCurPkmn, cCurPkmn, uAttack, 'c');
                                    clickListener('.textbox_attack_next', () => {
                                        if(cCurPkmn.curHP <= 0){
                                            typewriterInit(document.querySelector('.textbox_text'), `The opposing ${sFix(cCurPkmn.name)} has fainted!`);
                                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_fainted"> [Next] </span>';
                                            clickListener('.textbox_opponent_fainted', () => {
                                                if(cParty.indexOf(cCurPkmn) == (cParty.length - 1)){
                                                    typewriterInit(document.querySelector('.textbox_text'), `Your oppoent is out of useable pokemon. You win!`)
                                                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_game_end"> [Next] </span>';
                                                }else{
                                                    cCurPkmn = cParty[cParty.indexOf(cCurPkmn)+1];
                                                    document.querySelector('.compSprite').src = cCurPkmn.sprite.front;
                                                    document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
                                                    typewriterInit(document.querySelector('.textbox_text'), `Your opponent sent out ${sFix(cCurPkmn.name)}.`);
                                                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_next_pokemon"> [Next] </span>';
                                                    document.querySelector('.cHPBarFill').style.setProperty('width', hpBarWidth * (cCurPkmn.curHP / cCurPkmn.HP));
                                                    clickListener('.textbox_opponent_next_pokemon', buttonInit);
                                                }
                                            })
                                        }else{
                                            buttonInit();
                                        }
                                    });
                                }
                            });
                        }
                    });      
                    break;
                case '1':
                    
                    break;
                case '2':
                    pkmnSwitch(uCurPkmn, uParty);
                    clickListener('.pkmn_switch_button_active', (el) => {
                        let choice = el.target.value;
                        if(uCurPkmn != uParty[choice]){
                            uCurPkmn = uParty[choice]
                            document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                            document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                            barCheck('u', uCurPkmn);
                            document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                            typewriterInit(document.querySelector('.textbox_text'), `You sent out ${sFix(uCurPkmn.name)}!`);
                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_user_next_pokemon"> [Next] </span>';
                            document.querySelector('.battle_button_cont').innerHTML = '';
                            clickListener('.textbox_user_next_pokemon', () => {
                                turnRes(cCurPkmn, uCurPkmn, cCurPkmn.moves[Math.round(Math.random()*(cCurPkmn.moves.length-1))], 'u');
                                clickListener('.textbox_attack_next', buttonInit);
                            });
                        }else{
                            buttonInit();
                        }
                    });
                    break;

                default:
                        alert('Defaulting. Check logs.');
                }
            })
        )
    }
    buttonInit();
}
