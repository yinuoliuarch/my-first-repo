const cats = [
  {
    text: "not a phase",
    caption: "current mood: eyeliner and existential tuna",
    alt: "Emo meme cat saying not a phase"
  },
  {
    text: "be sad but hydrated",
    caption: "crying, but responsibly",
    alt: "Emo meme cat saying be sad but hydrated"
  },
  {
    text: "9 lives 0 plans",
    caption: "the calendar is a rumor",
    alt: "Emo meme cat saying 9 lives 0 plans"
  },
  {
    text: "ctrl alt weep",
    caption: "restarting the feelings machine",
    alt: "Emo meme cat saying ctrl alt weep"
  },
  {
    text: "text me when the moon is out",
    caption: "available after dusk only",
    alt: "Emo meme cat saying text me when the moon is out"
  },
  {
    text: "feral but font-aware",
    caption: "graphic design is my coping strategy",
    alt: "Emo meme cat saying feral but font-aware"
  },
  {
    text: "my playlist understands me",
    caption: "track seven knows everything",
    alt: "Emo meme cat saying my playlist understands me"
  }
];

const catImage = document.querySelector("#cat-image");
const catCaption = document.querySelector("#cat-caption");
const memeFrame = document.querySelector(".meme-frame");
const newCatButton = document.querySelector("#new-cat-button");

let currentCatIndex = 0;

function createCatUrl(text) {
  const phrase = encodeURIComponent(text);
  const cacheBreaker = Date.now();

  return `https://cataas.com/cat/says/${phrase}?fontSize=42&fontColor=white&width=900&height=675&t=${cacheBreaker}`;
}

function showNextCat() {
  currentCatIndex = (currentCatIndex + 1) % cats.length;
  const cat = cats[currentCatIndex];

  memeFrame.classList.remove("is-changing");
  void memeFrame.offsetWidth;
  memeFrame.classList.add("is-changing");

  catImage.src = createCatUrl(cat.text);
  catImage.alt = cat.alt;
  catCaption.textContent = cat.caption;
}

catImage.addEventListener("error", () => {
  catImage.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 675'%3E%3Crect width='900' height='675' fill='%23151015'/%3E%3Ctext x='50%25' y='48%25' fill='%23e23553' font-family='Courier New, monospace' font-size='46' text-anchor='middle'%3Ecat image loading...%3C/text%3E%3Ctext x='50%25' y='58%25' fill='%23f4edf0' font-family='Courier New, monospace' font-size='26' text-anchor='middle'%3Ethe drama remains%3C/text%3E%3C/svg%3E";
});

newCatButton.addEventListener("click", showNextCat);
