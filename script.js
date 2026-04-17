// reference to DOM elements
const btn = document.getElementById("btn");
const box = document.getElementById("insultBox");
const history = document.getElementById("history");

btn.addEventListener("click", getInsult);  // click event

// fetch insult from API
function getInsult() {
    const url = "https://evilinsult.com/generate_insult.php?lang=en&type=json";  // API url

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const parsed = JSON.parse(data.contents);  // note: API returns html-wrapped json string in data.contents

            let insult = cleanInsult(parsed.insult);  // clean up html entities + formatting issues

            box.innerText = insult;  // display in main box
            addToHistory(insult);  // add to history list
            animateBox(box);  // run animation
        })
        .catch(err => {
            console.log(err);
            box.innerText = "Error loading insult";
        });
}

// html entity decoder
function decodeHtml(input) {
    if (!input) return "";

    // converts html to characters (ex: &quot -> ", &amp -> &, etc.)
    return new DOMParser()
        .parseFromString(input, "text/html")
        .documentElement.textContent || "";
}

// clean text
function cleanInsult(str) {
    return decodeHtml(str)
        .replace(/\s*--->\s*/g, " → ")  // replace with arrow symbol
        .replace(/\s+/g, " ")  // normalize extra whitespace
        .trim();
}

// add to history list
function addToHistory(insult) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerText = insult;
    history.prepend(item);
}

// animation
function animateBox(element) {
    const { physics, value } = window.popmotion;

    const y = value(0, v => {  // bridge between animation engine and DOM
        element.style.transform = `translateY(${v}px)`;
    });

    physics({
        from: -120,  // start
        to: 0,  // end
        velocity: 300,  // initial speed
        springStrength: 500,
        friction: 0.8  // damping (higher = faster stop)
    }).start(y);
}