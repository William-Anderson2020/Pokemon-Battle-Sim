import { get } from "./apiCall";
import { pkmnSelect } from "./pkmnSelect";

(async function(){
    let typeData = await get.type();
    console.log(typeData);


    pkmnSelect();
})();
//console.log(get.pkmn('ditto').name);