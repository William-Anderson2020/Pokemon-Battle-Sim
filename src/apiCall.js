async function re(type, id){
    try{
        let result = await fetch(`https://pokeapi.co/api/v2/${type}/${id}`);
        let data = await result.json();
        //console.log(data)
        return data;
    }catch(err){
        alert(`Sorry, we didn't recognize that request.`);
        console.log(err)
    }
}

export let get = {
    async pkmn(id){return await re('pokemon', id);},
    async type(){
        let typeList = [];
        let data = await re('type', '');
        data.results.forEach(async (el, i) => {
            let typeData = await re('type', el.name);
            typeList.push(typeData);
        });
        return typeList;
    },
    async move(id){return await re('move', id);},
    async item(id){return await re('item', id);}
}