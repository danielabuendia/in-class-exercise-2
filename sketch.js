let uiFont = "Helvetica";
let canvasW = 540,
  canvasH = 960;

let bg;
let imgMilk, imgAvocado, imgBanana, imgDoritos, imgPoptarts, imgYoghurt;
let imgHummus, imgBread, imgSalad, imgCilantro, imgBaguette, imgApple;

let csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmfR0_V7dGU1sXwV1XKlX8dwjUgnehAsRYG49RLOlLeQozmwMsV1K2zUBd6jrS4q1SSxS29TqJmFPA/pub?gid=0&single=true&output=csv";
let tabla,
  info = {};

let elements = [];
let hoverData = null;

function preload() {
  bg = loadImage("bgImg.JPG", () => {});
  imgMilk = loadImage("milk.PNG");
  imgAvocado = loadImage("avocado.PNG");
  imgBanana = loadImage("banana.PNG");
  imgDoritos = loadImage("doritos.PNG");
  imgPoptarts = loadImage("poptarts.PNG");
  imgYoghurt = loadImage("yoghurt.PNG");
  imgHummus = loadImage("hummus.PNG");
  imgBread = loadImage("bread.PNG");
  imgSalad = loadImage("salad.PNG");
  imgCilantro = loadImage("cilantro.PNG");
  imgApple = loadImage("apple.PNG");
  imgBaguette = loadImage("baguette.PNG");

  tabla = loadTable(csvUrl, "csv", "header");
}

function setup() {
  createCanvas(canvasW, canvasH);
  textFont(uiFont);

  elements = [
    { img: imgApple, x: 80, y: 500, w: 220, h: 220, key: null },
    { img: imgBread, x: 160, y: 500, w: 300, h: 300, key: null },
    { img: imgBaguette, x: 1, y: 300, w: 360, h: 360, key: null },
    { img: imgCilantro, x: 280, y: 550, w: 270, h: 270, key: null },

    { img: imgMilk, x: 105, y: 340, w: 250, h: 250, key: "milk" },
    { img: imgAvocado, x: 260, y: 330, w: 250, h: 250, key: "avocado" },
    { img: imgBanana, x: 110, y: 600, w: 220, h: 220, key: "banana" },
    { img: imgDoritos, x: 190, y: 470, w: 180, h: 180, key: "doritos" },
    { img: imgPoptarts, x: 320, y: 660, w: 150, h: 150, key: "poptarts" },
    { img: imgYoghurt, x: 220, y: 380, w: 110, h: 110, key: "yogurt" },
    { img: imgHummus, x: 310, y: 530, w: 130, h: 130, key: "hummus" },
  ];

  leerSheet();
}

function draw() {
  if (bg) {
    let sx = width / bg.width,
      sy = height / bg.height,
      s = Math.max(sx, sy);
    image(
      bg,
      (width - bg.width * s) / 2,
      (height - bg.height * s) / 2,
      bg.width * s,
      bg.height * s
    );
  }

  hoverData = null;

  for (let e of elements) {
    if (!e.img) continue;

    let s = Math.min(e.w / e.img.width, e.h / e.img.height);
    let bw = e.img.width * s;
    let bh = e.img.height * s;

    let over =
      e.key &&
      mouseX >= e.x &&
      mouseX <= e.x + bw &&
      mouseY >= e.y &&
      mouseY <= e.y + bh;

    let f = over ? 1.2 : 1.0;

    let cw = bw * f,
      ch = bh * f;
    let cx = e.x + bw / 2,
      cy = e.y + bh / 2;
    image(e.img, cx - cw / 2, cy - ch / 2, cw, ch);

    if (over && info[e.key]) hoverData = info[e.key];
  }

  if (hoverData) {
    mostrarTooltip(hoverData, mouseX, mouseY);
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function leerSheet() {
  info = {};
  if (!tabla) return;

  let claves = [];
  for (let e of elements) if (e.key) claves.push(e.key);

  for (let r = 0; r < tabla.getRowCount(); r++) {
    let product = String(tabla.getString(r, "Product") || "");
    let low = product.toLowerCase();

    let key = null;
    for (let k of claves) {
      if (low.includes(k) || (k === "yogurt" && low.includes("yoghurt"))) {
        key = k;
        break;
      }
    }
    if (!key) continue;

    info[key] = {
      title: product,
      price: String(tabla.getString(r, "Price (USD)") || ""),
      cal: String(tabla.getString(r, "Calories") || ""),
      prot: String(tabla.getString(r, "Protein (g)") || ""),
      fat: String(tabla.getString(r, "Total Fat (g)") || ""),
      sodium: String(tabla.getString(r, "Sodium (mg)") || ""),
    };
  }
}

function mostrarTooltip(d, mx, my) {
  let w = 240,
    pad = 10,
    r = 14;
  let x = mx + 12,
    y = my + 12;

  let price = d.price;
  if (price && price.charAt(0) !== "$") price = "$" + price;
  let lines = [];
  if (price) lines.push("Price: " + price);
  if (d.cal) lines.push("Calories: " + d.cal);
  if (d.prot) lines.push("Protein: " + d.prot + " g");
  if (d.fat) lines.push("Total fat: " + d.fat + " g");
  if (d.sodium) lines.push("Sodium: " + d.sodium + " mg");
  if (lines.length === 0) lines.push("(No data)");

  textSize(16);
  textStyle(BOLD);
  let titleH = 20 * ceil(textWidth(d.title) / (w - 2 * pad));
  let h = pad + titleH + 6 + lines.length * 18 + pad;

  if (x + w > width - 6) x = width - w - 6;
  if (y + h > height - 6) y = height - h - 6;

  noStroke();
  fill(0, 120);
  rect(x + 3, y + 4, w, h, r);
  fill(255);
  rect(x, y, w, h, r);

  fill(0);
  textAlign(LEFT, TOP);
  text(d.title, x + pad, y + pad, w - 2 * pad, titleH);
  textSize(14);
  textStyle(NORMAL);
  let yy = y + pad + titleH + 6;
  for (let t of lines) {
    text(t, x + pad, yy);
    yy += 18;
  }
}
