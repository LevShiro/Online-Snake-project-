
let score = 0;
function EatApple() {
    score+=1;
    document.getElementById("score").textContent= score
    console.log(score)
}
const sendData = async (url)=>{
    const responce = await fetch(url,{
        method:'POST',
        headers: {'X-CSRFToken': Cookies.get('csrftoken')},
        body:JSON.stringify({
            score:score,
        }),
    })
    if (!responce.ok) {
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${responce}`)
    }
    console.log('fffff',score)
    score=0
    document.getElementById("score").textContent= score
    $('#nickname-score').load(document.URL +  ' #nickname-score');
}





