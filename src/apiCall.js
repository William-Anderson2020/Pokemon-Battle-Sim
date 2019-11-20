export async function apiCall(type, val){
    let result = await fetch(`https://pokeapi.co/api/v2/${type}/${val}`);
    let data = await result.json();
    return data;
}

async function re(type, id){
    let result = await fetch(`https://pokeapi.co/api/v2/${type}/${id}`);
    let data = await result.json();
    console.log(data)
    return data;
}

export let get = {
    pkmn(id){re('pokemon', id)},
    type(id){re('type', id)},
    move(id){re('move', id)},
    item(id){re('item', id)}
}