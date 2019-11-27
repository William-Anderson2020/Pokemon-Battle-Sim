import { clickListener } from "./clickListener";
import { get } from "./apiCall";
import { partyInit } from "./partyInit";

export function pkmnSelect() {
  let count;
  let form = document.querySelector(".pkmn_count");
  let uParty = [];
  let cParty = [];
  clickListener(".pkmn_count_submit", function() {
    
    count = document.querySelector('input[name="pkmn_count"]:checked').value;
    console.log(count);
    form.innerHTML = "";
    form.innerHTML = `<div class="pkmn_select"> <input class="pkmn_select_name "type="text" value="Name a Pokemon" onfocus="this.value = ''"> <input type="submit" class="pkmn_select_submit"> </div> <div class="selection_sprite_holder"> </div> <div class="selection_VS"> </div> <div class="c_sprite_holder"> </div> </div>`;
    
    clickListener(".pkmn_select_submit", async function partyBuild() {
      //Party Builder
      let selection = document.querySelector(".pkmn_select_name").value.toLowerCase();
      let data = await get.pkmn(selection);
      if(data == undefined){
      return;
      }
      else{
        let pkmn = await data;
        let cPkmn = await get.pkmn(Math.round(Math.random() * 807))
        uParty.push(pkmn);
        cParty.push(cPkmn);

        document.querySelector(".selection_sprite_holder").insertAdjacentHTML("beforeend",`<img src="${pkmn.sprites.front_default}" class="selection_sprite">`);
          if(uParty.length == count){
            document.querySelector('.pkmn_select').innerHTML = '<input type="submit" name="pkmn_confirm" id="pkmn_confirm" value="Proceed">'
            document.querySelector('.selection_VS').innerHTML= 'VS'
            cParty.forEach((el) => {
              document.querySelector('.c_sprite_holder').insertAdjacentHTML("beforeend", `<img src="${el.sprites.front_default}" class="selection_sprite">`);
            });
            clickListener('#pkmn_confirm', (() => {
              partyInit(uParty, cParty);
            }));
          }
      }
    });
  });
};