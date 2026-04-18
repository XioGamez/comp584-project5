// reference to DOM elements
const btn = document.getElementById("btn");
const box = document.getElementById("insultBox");
const history = document.getElementById("history");

btn.addEventListener("click", getInsult);  // click event

// fetch insult from API
function getInsult() {
    fetch("https://insult.mattbas.org/api/insult.json")  // API url
        .then(res => res.json())
        .then(data => {
            const insult = cleanInsult(data.insult || data.message);  // clean up html entities + formatting issues

            box.innerText = insult;  // display in main box
            addToHistory(insult, data);  // add to history list
            animateBox(box);  // run animation
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
function addToHistory(insult, fullData) {
    // create container for new entry
    const item = document.createElement("div");
    item.className = "history-item";

    // insult visible (always shown)
    const shortText = document.createElement("div");
    shortText.className = "short-text";
    shortText.innerText = insult;

    // expanded info (hidden default)
    const fullText = document.createElement("div");
    fullText.className = "full-info";
    fullText.innerText = JSON.stringify(fullData, null, 2);

    item.appendChild(shortText);
    item.appendChild(fullText);

    // handles toggle dropdown
    item.addEventListener("click", () => {
        item.classList.toggle("expanded");

        // smooth dynamic height
        if (item.classList.contains("expanded")) {
            fullText.style.maxHeight = fullText.scrollHeight + "px";
        } else {
            fullText.style.maxHeight = "0px";
        }
    });

    history.prepend(item);  // add new entry to top of history
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

function toggleExpand(element) {
    element.classList.toggle("expanded");
}