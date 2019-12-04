import { get } from "./apiCall";
import { pkmnSelect } from "./pkmnSelect";
import { clickListener } from "./clickListener";

(async function(){
    pkmnSelect();
})();

clickListener('textbox_game_end', () => {
    location.reload();
});
//console.log(get.pkmn('ditto').name);