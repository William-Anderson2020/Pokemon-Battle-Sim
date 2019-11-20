import { get, apiCall } from "./apiCall";

async function test(){
    console.log(apiCall('pokemon', 'ditto').name);
}
test();
//console.log(get.pkmn('ditto').name);
