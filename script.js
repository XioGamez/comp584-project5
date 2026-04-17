// reference to DOM elements
const btn = document.getElementById("btn");
const box = document.getElementById("insultBox");
const history = document.getElementById("history");

btn.addEventListener("click", getInsult);  // click event

// fetch insult from API
function getInsult() {
    fetch("https://insult.mattbas.org/api/insult.json")
        .then(res => res.json())
        .then(data => {
            const insult = cleanInsult(data.insult || data.message);

            box.innerText = insult;
            addToHistory(insult);
            animateBox(box);
        })
        .catch(() => {
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