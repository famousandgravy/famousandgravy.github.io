//elements on the page
    // banner = document.getElementById("banner").innerHTML
    // sidebar = document.getElementById("sidebar").innerHTML
    // top = document.getElementById("top").innerHTML
    // middle = document.getElementById("middle").innerHTML
    // button = document.getElementById("button").innerHTML
    // bottom = document.getElementById("bottom").innerHTML

//fix for mobile viewport from https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

let qs;
let score = 0;
let answers = [];
let guess = [];

let previous = sessionStorage.getItem('previous');
var csv = ''
var xhr;
let who = "Who is that?"

//called after page is loaded and populates the page with home menu
function home(){
    h = 253.249992;
    if(previous == null || previous == ''){
        readTxtDoc();
        blank();
        //filler for margins on desktop
        document.getElementById("overlay").innerHTML=`<div style='position: relative; float: left; width: 50vw; z-index: -3; height: ${h}px; background-color: #242424;'></div><div style='position: relative; margin-left: 50vw; width: 50vw; z-index: -3; height: ${h}px; background-color: #00C027;'></div>`;
        //homepage banner
        document.getElementById("banner").innerHTML = "<a href='https://www.famousandgravy.com/' target='_blank'><img id='home' style='position: relative; z-index: 3;' src='./images/home.svg' alt='Dead or Alive from Famous and Gravy and link to Famous and Gravy page'></a>";
        //play button
        document.getElementById("button").innerHTML = "<button onclick='generateQ(0)'><img src='./images/play.svg' alt='play button'></button>";
    }else{
        csv = sessionStorage.getItem('data');
        generateQ(0);
    }
    
}

function generateQ(qNum){
    blank();
    if(qNum == 0){
        //console.log(formatData());
        qs = pickSeven(formatData());
    }
    document.getElementById("banner").innerHTML = "<img id='qBanner' src='./images/banner.svg' alt='banner'>"
    document.getElementById("top").innerHTML = `<div id='q'>${qs[qNum][1]}</div`
    document.getElementById("middle").innerHTML = `<button onclick='answer(${qNum},\"\")'><img src='./images/dead.svg' alt='dead button'></button> <button onclick='answer(${qNum},\"ALIVE\")'><img src='./images/alive.svg' alt='alive button'></button>`
    if (qs[qNum][4] != ''){
        document.getElementById("button").style.textAlign = "center";
        /* document.getElementById("button").innerHTML = `
        <p onclick='hint(${qNum},0)'>
        <i>${who}</i><img style='width: 20px; margin: 5px;' src='./images/plus.svg' alt='hint'>
        </p></div`; */
        document.getElementById("button").innerHTML = `
        <button style="transform: translateY(-70px);" onclick='hint(${qNum},0);'><img style="border: 2px solid black;" src='./images/hint.svg' alt='hint button'></button>
        `
    }
}

function answer(qNum, value){
    blank();
    yod = qs[qNum][3];
    yob = qs[qNum][5];
    //make position account for sidebar
    document.getElementById("position").style.textAlign = "left";
    document.getElementById("position").style.marginLeft = "80px";
    document.getElementById("middle").style.textAlign = "left";
    if (value == ''){
        guess.push('Dead');
    }else{
        guess.push('Alive');
    }
    if(qs[qNum][2] == ''){
        //black sidebar
        document.getElementById("sidebar").innerHTML = "<div style='background-color: #242424; height: 100vh; width: 65px;'></div>";
        if(value == ''){
            document.getElementById("top").innerHTML = "<h1>Right.</h1>";
            score += 1;
            answers.push("right")
        }else{
            document.getElementById("top").innerHTML = "<h1>Incorrect.</h1>";
            answers.push("wrong")
        }
       document.getElementById("middle").innerHTML = `<span>${qs[qNum][1]} died in ${yod}.</span>`;

    }else{
        //green sidebar
        document.getElementById("sidebar").innerHTML = "<div style='background-color: #00C027; height: 100vh; width: 65px;'></div>";
        if(value == 'ALIVE'){
            document.getElementById("top").innerHTML = "<h1>Right.</h1>";
            score += 1;
            answers.push("right")
        }else{
            document.getElementById("top").innerHTML = "<h1>Incorrect.</h1>"
            answers.push("wrong")
        }
        document.getElementById("middle").innerHTML = `<span>${randomStr(qs[qNum][1], qs[qNum][2], yod, yob)}</span>`;
    }
    qNum ++
    if(qNum < 7){
        document.getElementById("button").innerHTML = `<button onclick='generateQ(${qNum})'><img src='./images/next.svg' alt='next button'></button>`;
    /* }else{
        document.getElementById("button").innerHTML = "<button onclick='podPage()'><img src='./images/finish.svg' alt='finish button'></button>";
    } */
    }else{
        document.getElementById("button").innerHTML = `<button style='margin-top: 20px;' onclick='results();'><img src='./images/continue.svg' alt='continue button'></button>`;
        resultButton();
    }
    document.getElementById("bottom").innerHTML = `<span>${qNum} / 7</span>`;

    fade();

}

/* //continue instead of see results
function podPage(){
    blank()
    document.getElementById("top").style.textAlign = "left";
    document.getElementById("middle").style.marginTop = "20px";
    document.getElementById("top").innerHTML = "<div style='margin-top: -70px; margin-left: 15px; margin-right: 15px; font-size: 30px; line-height: 1.2;'>If you enjoy playing <i>Dead or Alive</i>, listen to the podcast that inspired it:</div>";
    document.getElementById("middle").innerHTML = `
    <a href='https://www.famousandgravy.com/' target='_blank'><img style='margin-top: -20px; height: 72%' src='./images/rounded logo.svg' alt='Famous and Gravy logo with link to website'></a><br>
    <a href='https://open.spotify.com/show/0H7YEeFXKpFXVhTPER99D3' target='_blank'><img style= 'margin-top: 15px; height: 16.8%' src='./images/spotify.svg' alt='Spotify Link'></a><br>
    <a href='https://podcasts.apple.com/us/podcast/famous-gravy/id1601060826' target='_blank'><img style= 'margin-top: 15px; height: 16.8%' src='./images/apple.svg' alt='Apple Podcast Link'></a>
    `
    document.getElementById("button").innerHTML = "<span>Generating Results...</span><br><br><img width='50px' src='./images/loading.gif' alt='loading...'>";
    resultButton()
} */

function results(){
    blank();
    //delete
    document.getElementById("middle").style.textAlign = "left";
    document.getElementById("middle").style.marginTop = "-50px";
    document.getElementById("banner").innerHTML = `
    <br>
    <button onclick='setPrevious();'><img src='./images/again.svg' alt='play again button'></button>
    <div style=' text-align: left; margin: 15px; font-size: 30px; line-height: 1.2;'>You got ${score} out of 7.</div>`;
    document.getElementById("middle").innerHTML = `
    <table>
    <tr>
    <th><b>Celebrity</b></th>
    <th><b>Is</b></th>
    <th></th>
    <th><b>Guess</b></th>
    </tr>
    ${tableContents()}
    </table>
    `
    document.getElementById("button").innerHTML = `<span>Listen here:<span><br><button onclick='window.location.href="https://pod.link/1601060826"'><img src='./images/horiz logo.png' alt='Famous & Gravy'></button>`;
}
//return string with table contents
function tableContents(){
    content = ''
    for(i = 0; i < answers.length; i++){
        is = ''
        if(qs[i][2] == ''){
            is = 'Dead'
        }else{
            is = 'Alive'
        }
        content+= `
        <tr>
        <td>${qs[i][1]}</td>
        <td>${is}</td>
        <td><img height="20px" src="./images/${answers[i]}.svg" alt="${answers[i]}"></td>
        <td>${guess[i]}</td>
        </tr>
        `
    }
    return content
}

//sets session storage data for previous questions
function setPrevious(){
    names = ''
    for(i = 0; i < qs.length; i++){
        names += `${qs[i][1]},`
    }
    if(previous == null){
        sessionStorage.setItem('previous', `${names}`);
    }else{
        previous += names;
        sessionStorage.setItem('previous', `${previous}`);
    }
    sessionStorage.setItem('data', csv)
    location.reload()
}



//clears all html elements
function blank(){
    document.getElementById("banner").innerHTML = '';
    document.getElementById("sidebar").innerHTML = '';
    document.getElementById("top").innerHTML = '';
    document.getElementById("middle").innerHTML = '';
    document.getElementById("button").innerHTML = '';
    document.getElementById("bottom").innerHTML = '';
    document.getElementById("overlay").innerHTML = '';
    document.getElementById("position").style.textAlign = ""
    document.getElementById("position").style.marginLeft = ""
    document.getElementById("middle").style.textAlign = "center"
    document.getElementById("body").style.opacity = 1;
}

//returns list from CSV
function formatData(){
    str = csv
    str2 = str
    dataArray = str2.split(/\r?\n/);
    for(i = 0; i < dataArray.length; i ++){
        dataArray[i] = dataArray[i].split(/,/);
    }
    return dataArray;
}

//get csv data
function readTxtDoc() {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        // Create an XMLHttpRequest object
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5  
        // Create an ActiveXObject object
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // Define a callback function
    xmlhttp.onload = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Here you can use the Data
            csv = xmlhttp.responseText;
        }
    }

    // Send a request
    xmlhttp.open("GET", "./dead_or_alive - data.csv", true);
    xmlhttp.send();
}

//wait for results button
const delay = ms => new Promise(res => setTimeout(res, ms));

const resultButton = async () => {
    if (window.ActiveXObject){
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } 
    else if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }

    //build url
    const params = new URLSearchParams({
        celeb1: qs[0],
        celeb2: qs[1],
        celeb3: qs[2],
        celeb4: qs[3],
        celeb5: qs[4],
        celeb6: qs[5],
        celeb7: qs[6],
        results: guess
    });
    var url = "./data.php?" + params.toString();
    // Open a connection to the server
    xhr.open("GET", url, true);
    // Setup a function for the server to run when it is done
    // Send the request
    xhr.send(null);
    await delay(3000);
    //console.log(xhr.readyState==4);
    /* document.getElementById("button").innerHTML = ""
    document.getElementById("button").innerHTML = `
    <button style='margin-top: 20px;' onclick='results();'><img src='./images/continue.svg' alt='continue button'></button>
    `; */
  
};

//transition between question and answer
const transition = async (qNum, value) => {
    document.getElementById("qBanner").style.animation = "transition 1.3s linear 1";
    document.getElementById("middle").innerHTML = '';
    await delay(1200);
    answer(qNum, value);
}

async function fade(){
    var body = document.getElementById("body");
    var time = 1000
    body.style.opacity = 0;
    var last = +new Date();
    var tick = function() {
        body.style.opacity = +body.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+body.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}
//populate hint
function hint(qNum, toggle){
    if(toggle == 0){
        document.getElementById("button").innerHTML = '';
        /* document.getElementById("button").innerHTML =  `
        <p onclick='hint(${qNum}, 1)'>
        <i>${who}</i><img style='width: 20px; margin: 5px; transform: rotate(45deg)' src='./images/plus.svg' alt='hint'>
        <br>
        ${qs[qNum][4]}
        </p>` */
        document.getElementById("button").innerHTML =  `
        <p>
        ${qs[qNum][4]}
        </p>`
    }else{
        document.getElementById("button").innerHTML = '';
        document.getElementById("button").innerHTML = `
        <p onclick='hint(${qNum}, 0)'>
        <i>${who}</i><img style='width: 20px; margin: 5px;' src='./images/plus.svg' alt='hint'>
        </p>`
    }
}

//returns random string to be used on answer page
function randomStr(name, stat, yod, yob){
    dead = [' died in ', ' passed away in ', ' left us in ']
    alive = [[' is alive at ', ' years old.'], [' is ', ' years old and still going.'], [' is still with us at ', ' years old.']]
    if(stat == ''){
        n = Math.floor(Math.random() * dead.length);
        string = `${name}${dead[n]}${yod}`;
    }else{
        n = Math.floor(Math.random() * alive.length);
        string = `${name}${alive[n][0]}${getAge(yob)}${alive[n][1]}`;
    }
    return string
}

//returns string of how old the person is
function getAge(yob){
    today = new Date();
    birthDate = new Date(yob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return `${age}`;
}

//returns seven random Celebrities from the data list
function pickSeven(data){
    seven = []
    pick = []
    if(previous == null){
        repeat = []
    }else{
        repeat = previous.split(",")
    }
    //generate 7 unique index numbers from the data list
    //make sure the index isn't a "HIDDEN"
    //make sure the name isn't a repeat in the session
    while(seven.length < 7){
        n = Math.floor(Math.random() * data.length);
        if(!seven.includes(n) && n > 0 && data[n][0] == '' && !repeat.includes(data[n][1])){
            seven.push(n)
            pick.push(data[n])
        }
    }
    return pick;
}

//pushes the results of the users answers to data.php to record the data
function pushQsAndAs(){
    return
}
