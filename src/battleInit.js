import { get } from './apiCall'

class PKMN{
    constructor(pkmn){
        this.name = pkmn.name;
        this.types = pkmn.types.map(el => get.type(el.type.name));
        [this.speed, this.sDef, this.sAtk, this.Def, this.Atk, this.HP] = pkmn.stats.map(el => el.base_stat);
    }
    /* async typeInit(){
        this.types.map(el => await el);
    } */
}

export function battleInit(uParty, cParty){
    //console.log(uParty, cParty);
    let u1 = new PKMN(uParty[0]);
    console.log(u1);
}