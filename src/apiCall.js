export async function apiCall(type, val){
    let result = await fetch(`https://pokeapi.co/api/v2/${type}/${val}`);
    let data = await result.json();
    return data;
}