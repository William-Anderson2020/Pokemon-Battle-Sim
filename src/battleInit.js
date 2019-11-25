import { get } from './apiCall'

let typeData;
(async() => {
    typeData = await get.type();
})()

class PKMN{
    constructor(pkmn){
        this.name = pkmn.name;
        this.types = typeData.map(
            el => {
                let ty = pkmn.types.map(i => i.type.name);
                let elName = el.name;
                console.log(ty, el)
                for(elName in ty){
                    return el;
                }
            }
        );
        [this.speed, this.sDef, this.sAtk, this.Def, this.Atk, this.HP] = pkmn.stats.map(el => el.base_stat);
    }
}

/* async function typeInit(pkmn){
    let data = await pkmn.types.map(async(el) => await get.type(el));
    then(data, () => data);
    console.log(data);
    return(data);
} */

export async function battleInit(uParty, cParty){
    //console.log(uParty, cParty);
    let u1 = new PKMN(uParty[0]);
    //u1.types = await typeInit(u1);
    console.log(u1);
}