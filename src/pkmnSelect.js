import { clickListener } from "./clickListener";
import { get } from "./apiCall";

export function pkmnSelect() {
  let count;
  let form = document.querySelector(".pkmn_count");
  let userSelections = [];
  let compParty = [];
  clickListener(".pkmn_count_submit", function() {
    count = document.querySelector('input[name="pkmn_count"]:checked').value;
    console.log(count);
    form.innerHTML = "";
    form.innerHTML = `<div class="pkmn_select"> <input class="pkmn_select_name "type="text" value="Name a Pokemon" onfocus="this.value = ''"> <input type="submit" class="pkmn_select_submit"> </div> <div class="selection_sprite_holder"> </div> </div>`;
    clickListener(".pkmn_select_submit", async function() {
      let selection = document.querySelector(".pkmn_select_name").value.toLowerCase();
      let pkmn = await get.pkmn(selection);
      userSelections.push(pkmn);
      document.querySelector(".selection_sprite_holder").insertAdjacentHTML("beforeend",`<img src="${pkmn.sprites.front_default}">`);
        if(userSelections.length == count){
          document.querySelector('.pkmn_select').innerHTML = '<input type="submit" name="pkmn_confirm" id="pkmn_confirm" value="Proceed">'
          clickListener('#pkmn_confirm', function(){
            form.innerHTML = '';
            /* while(compParty.length < count){
              async () => {
                let cPkmn = get.pkmn(Math.floor(Math.random() * 807))
                compParty.push(cPkmn); //May need updating if api expands.
              }
            } //crash loop
            compParty = compParty.map(async(el) => await el);
            console.log(compParty); */ //still crashes
          });
        }
    });
  });
}
