import { get } from './apiCall'

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
                console.log(el.name, ty)
                if(ty.includes(el.name)){
                    return el;
                };
            }
        );
        [this.speed, this.sDef, this.sAtk, this.Def, this.Atk, this.HP] = pkmn.stats.map(el => el.base_stat);
        this.moves = pkmn.moves.map(el => el.move.name);
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