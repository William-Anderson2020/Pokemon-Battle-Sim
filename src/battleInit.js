import { get } from './apiCall'

class PKMN{
    constructor(pkmn){
        this.name = pkmn.name;
        this.types = pkmn.types.map(el => el.type.name);
        [this.speed, this.sDef, this.sAtk, this.Def, this.Atk, this.HP] = pkmn.stats.map(el => el.base_stat);
    }
}

async function typeInit(pkmn){
    let data = await pkmn.types.map(async(el) => await get.type(el));
    then(data, () => data);
    console.log(data);
    return(data);
}

export async function battleInit(uParty, cParty){
    //console.log(uParty, cParty);
    let u1 = new PKMN(uParty[0]);
    u1.types = await typeInit(u1);
    console.log(u1);
}