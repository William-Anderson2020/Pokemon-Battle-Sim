import { get } from "./apiCall";
import { pkmnSelect } from "./pkmnSelect";

(async function(){
    let typeData = await get.type();
    console.log(typeData);


    let uParty, cParty = pkmnSelect();
    console.log(uParty, cParty);
})();
//console.log(get.pkmn('ditto').name);