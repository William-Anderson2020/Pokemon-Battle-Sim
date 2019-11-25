async function re(type, id){
    let result = await fetch(`https://pokeapi.co/api/v2/${type}/${id}`);
    let data = await result.json();
    //console.log(data)
    return data;
}

export let get = {
    async pkmn(id){return await re('pokemon', id);},
    async type(){
        let typeList = [];
        let data = await re('type', '');
        data.results.forEach((el, i) => {
            let typeData = fetch(el.url);
            typeList.push(typeData);
        });
        return await typeList;
    },
    async move(id){return await re('move', id);},
    async item(id){return await re('item', id);}
}