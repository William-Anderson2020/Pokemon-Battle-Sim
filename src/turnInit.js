import { clickListener } from "./clickListener";
import { typewriterInit, sFix, barCheck } from "./anim"

export function turnInit(uParty, cParty){
    let window = document.querySelector('.window');

    let uCurPkmn = uParty[0];
    let cCurPkmn = cParty[0];

    let potion = get.item('potion');
    let potionCount = 5;

    console.log(uParty, cParty);
    window.innerHTML = `<div class="battle_cont"><div class="disp cDisp"> <div class="name, cPkmnName"></div> <div class="cHPBar HPBar"> <div class="cHPBarFill HPBarFill"></div> </div> </div><div class="battle_sprite_cont"><img class='userSprite battleSprite' src="${uCurPkmn.sprite.back}"></img><img class='compSprite battleSprite' src="${cCurPkmn.sprite.front}"></div> <div class="disp uDisp"> <div class="name, uPkmnName"></div> <div class="uHPBar HPBar"> <div class="uHPBarFill HPBarFill"></div> </div> </div>  </div> <div class="textbox"> <div class="textbox_text"></div> <div class="textbox_next"></div> </div> <div class="battle_button_cont"> <button class="turn_button btn" value="0">Attack</button><button class="turn_button btn" value="1">Items</button><button class="turn_button btn" value="2">Pokemon</button> </div>`;

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
                if(dmgClass == 'status'){
                    if(curAttack.name == 'transform'){
                        uParty[uParty.findIndex((el) => el == uCurPkmn)] = cCurPkmn;
                        uCurPkmn = cCurPkmn;
                        document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                        document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                        document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                        messege = `Ditto transformed into ${sFix(uCurPkmn.name)}!`;
                    }else if(curAttack.name == 'protect' || curAttack.name == 'detect'){
                        messege = `${sFix(curAttacker.name)} used ${curAttack.name} and braced itself!`
                        curAttacker.protected = true;
                    }else if(curAttack.stat_changes.length != 0){
                        statRes(curAttacker, curDefender, curAttack);
                    }else{
                        messege = `${sFix(curAttacker.name)} used ${sFix(curAttack.name)}, but it failed!`;
                    }
                }else if(curDefender.protected == true){
                    messege = `${sFix(curDefender.name)} protected itself from ${sFix(curAttacker.name)}'s ${curAttack.name}!`
                }else if(dmgClass == 'special'){
                    damageCalc('sAtk', curAttacker, curDefender, curAttack);
                }else if(dmgClass == 'physical'){
                    damageCalc('atk', curAttacker, curDefender, curAttack);
                }
            }
            let hpBar;
            curDefender.curHP = Math.round(curDefender.curHP);
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
            curDefender.protected == false;
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
                case 'users-field':
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

        function pkmnSwitch(curPkmn, curParty){
            document.querySelector('.battle_button_cont').innerHTML = `<div class="switch_cont"><div class="switch_button_cont"></div><div class="select_switch_cont"><div class="select_back select_switch"><</div><div class="select_next select_switch">></div></div></div>`;
            let textBox = document.querySelector('.textbox_text');
            let nextBox = document.querySelector('.textbox_next');
            let bCont = document.querySelector('.switch_button_cont');
            let bArray = [];
            nextBox.innerHTML = '';
            curParty.forEach(el => {
                if(el.curHP <= 0){
                    el.curHP = 0;
                }
                let bString = `<button class="pkmn_switch_button %active% " value="${curParty.indexOf(el)}"> <img src=${el.sprite.front}> ${sFix(el.name)} ${Math.round(el.curHP)}/${el.HP}</button>`
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
                });
                clickListener('.pkmn_switch_button_active', (el) => {
                    let choice = el.target.value;
                    console.log(choice);
                    if(uCurPkmn != uParty[choice]){
                        uCurPkmn = uParty[choice];
                        console.log(uCurPkmn, uParty, choice);
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
            }
            changeDisp();
        
            clickListener('.select_back', () => {
                count--;
                changeDisp();
            })
        
            clickListener('.select_next', () => {
                count++;
                changeDisp();
            });
        
            clickListener('.pkmn_switch_button_inactive', (el) => {
                let pkmn = curParty[el.target.value];
                typewriterInit(textBox, (`${sFix(pkmn.name)} is unable to fight.`));
            });
        }

        function potionUse(){
            document.querySelector('.battle_button_cont').innerHTML = `<button class="potion"><img src="${potion.sprites.default}"> Heal 20 HP on your current Pkmn.</button>`;
            clickListener('.potion', () => {
                if (uCurPkmn.curHP <= 0){
                    messege = `${sFix(uCurPkmn.name)} has fainted and can't be healed.`;
                }else if(uCurPkmn.curHP == uCurPkmn.HP){
                    messege = `${sFix(uCurPkmn.name)} is already fully healed.`
                }else{
                    uCurPkmn.curHP += 20;
                    if(uCurPkmn.curHP > uCurPkmn.HP){
                        uCurPkmn.curHP = uCurPkmn.HP;
                    }
                }
                hpBar = document.querySelector('.uHPBarFill'); 
                
                barCheck('u', uCurPkmn);
            });
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
                                    typewriterInit(document.querySelector('.textbox_text'), `The opposing ${sFix(cCurPkmn.name)} has fainted!`);
                                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_fainted"> [Next] </span>';
                                    clickListener('.textbox_opponent_fainted', () => {
                                        if(cParty.indexOf(cCurPkmn) == (cParty.length - 1)){
                                            typewriterInit(document.querySelector('.textbox_text'), `Your oppoent is out of useable pokemon. You win!`);
                                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_game_end"> [Next] </span>';
                                            clickListener('.textbox_game_end', () => {
                                                location.reload();
                                            });
                                        }else{
                                            cCurPkmn = cParty[cParty.indexOf(cCurPkmn)+1];
                                            document.querySelector('.compSprite').src = cCurPkmn.sprite.front;
                                            document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
                                            typewriterInit(document.querySelector('.textbox_text'), `Your opponent sent out ${sFix(cCurPkmn.name)}.`);
                                            document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_next_pokemon"> [Next] </span>';
                                            document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
                                            document.querySelector('.cHPBarFill').style.setProperty('width', hpBarWidth* (cCurPkmn.curHP / cCurPkmn.HP));
                                            barCheck('c', cCurPkmn);
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
                                                clickListener('.textbox_game_end', () => {
                                                    location.reload();
                                                });
                                            }else{
                                                typewriterInit(document.querySelector('.textbox_text'), (`${sFix(uCurPkmn.name)} has fainted. Choose your next Pokemon.`));
                                                pkmnSwitch(uCurPkmn, uParty);
                                                clickListener('.pkmn_switch_button_active', (el) => {
                                                    let choice = el.target.value;
                                                    uCurPkmn = uParty[choice];
                                                    document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                                                    document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                                                    document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                                                    barCheck('u', uCurPkmn);
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
                                        clickListener('.textbox_game_end', () => {
                                            location.reload();
                                        });
                                    }else{
                                        typewriterInit(document.querySelector('.textbox_text'), (`${sFix(uCurPkmn.name)} has fainted. Choose your next Pokemon.`));
                                        pkmnSwitch(uCurPkmn, uParty);
                                        clickListener('.pkmn_switch_button_active', (el) => {
                                            let choice = el.target.value;
                                            uCurPkmn = uParty[choice];
                                            document.querySelector('.userSprite').src = uCurPkmn.sprite.back;
                                            document.querySelector('.uPkmnName').innerHTML = sFix(uCurPkmn.name);
                                            document.querySelector('.uHPBarFill').style.setProperty('width', hpBarWidth * (uCurPkmn.curHP / uCurPkmn.HP));
                                            barCheck('u', uCurPkmn);
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
                                                    clickListener('.textbox_game_end', () => {
                                                        location.reload();
                                                    });
                                                }else{
                                                    cCurPkmn = cParty[cParty.indexOf(cCurPkmn)+1];
                                                    document.querySelector('.compSprite').src = cCurPkmn.sprite.front;
                                                    document.querySelector('.cPkmnName').innerHTML = sFix(cCurPkmn.name);
                                                    typewriterInit(document.querySelector('.textbox_text'), `Your opponent sent out ${sFix(cCurPkmn.name)}.`);
                                                    document.querySelector('.textbox_next').innerHTML = '<span class="textbox_opponent_next_pokemon"> [Next] </span>';
                                                    document.querySelector('.cHPBarFill').style.setProperty('width', hpBarWidth * (cCurPkmn.curHP / cCurPkmn.HP));
                                                    barCheck('c', cCurPkmn);
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
                    break;

                default:
                        alert('Defaulting. Check logs.');
                }
            })
        )
    }
    buttonInit();
}
