import { get } from "./apiCall";
import { pkmnSelect } from "./pkmnSelect";

(async function(){
    /* let pkmn = await get.pkmn('pikachu');
    let type = await get.type('electric');
    let move = await get.move('thunderbolt');
    let item = await get.item('potion');
    console.log(pkmn.name, type.name, move.flavor_text_entries[2].flavor_text, item.name) */
    let uParty, cParty = pkmnSelect();
    console.log(uParty, cParty);
})();
//console.log(get.pkmn('ditto').name);