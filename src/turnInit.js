export function turnInit(uParty, cParty){
    let window = document.querySelector('.window');
    let textbox = document.querySelector('.textbox');

    let uCurPkmn = uParty[0];
    let cCurPkmn = cParty[0];

    console.log(uParty, cParty);
    window.innerHTML = `<img class='userSprite' src="${uCurPkmn.sprite.back}"></img><img class='compSprite' src="${cCurPkmn.sprite.front}"></img>`;
}