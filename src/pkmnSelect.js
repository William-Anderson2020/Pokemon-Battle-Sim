import { clickListener } from "./clickListener";
import { get } from "./apiCall";

export function pkmnSelect() {
  let count;
  let form = document.querySelector(".pkmn_count");
  let userSelections = [];
  clickListener(".pkmn_count_submit", function() {
    count = document.querySelector('input[name="pkmn_count"]:checked').value;
    console.log(count);
    form.innerHTML = "";
    form.innerHTML = `<div class="pkmn_select"> <input class="pkmn_select_name "type="text" value="Name a Pokemon" onfocus="this.value = ''"> <input type="submit" class="pkmn_select_submit"> </div> <div class="selection_sprite_holder"> </div> </div>`;
    clickListener(".pkmn_select_submit", async function() {
      let selection = document
        .querySelector(".pkmn_select_name")
        .value.toLowerCase();
      let pkmn = await get.pkmn(selection);
      userSelections.push(pkmn);
      document
        .querySelector(".selection_sprite_holder")
        .insertAdjacentHTML(
          "beforeend",
          `<img src="${pkmn.sprites.front_default}">`
        );
    });
    /* while(userSelections.length != 3){
        if(userSelections.length == 3){
            setTimeout(document.querySelector('.pkmn_select').innerHTML = '<input type="submit" name="pkmn_confirm" id="pkmn_confirm" value="Proceed">', 3000)
        }
    } */
  });
}
