let R;  // Will hold the Random class instance

// Assuming inputData with hash is globally available
class Random {
  constructor() {
    let offset = 0;
    for (let i = 2; i < 66; i += 8) offset += parseInt(inputData.hash.substr(i, 8), 16);
    offset %= 7;

    const p = pos => parseInt(inputData.hash.substr((pos + offset), 8), 16);
    let a = p(2) ^ p(34), b = p(10) ^ p(42), c = p(18) ^ p(50), d = p(26) ^ p(58) ^ p(2 + (8 - offset));

    this.r = () => {
      a |= 0; b |= 0; c |= 0; d |= 0;
      let t = (((a + b) | 0) + d) | 0;
      d = (d + 1) | 0; a = b ^ (b >>> 9);
      b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11);
      c = (c + t) | 0;
      return (t >>> 0) / 4294967296;
    };
    for (let i = 0; i < 256; i++) this.r();
  }
  random_dec = () => this.r();
  random_num = (a, b) => a + (b - a) * this.random_dec();
  random_int = (a, b) => Math.floor(this.random_num(a, b + 1));
  random_bool = (p) => this.random_dec() < p;
  random_choice = (list) => list[this.random_int(0, list.length - 1)];
}

let c, ctx;

function setup() {
  let aspectRatio = 0.75;
  let dp = window.devicePixelRatio;

  let ih = window.innerHeight * dp;
  let iw = window.innerWidth * dp;


  c = document.createElement('canvas');
  document.body.appendChild(c);

  if (iw / ih < aspectRatio) {
    c.width = iw;
    c.height = iw / aspectRatio;
  } else {
    c.width = ih * aspectRatio;
    c.height = ih;
  }

  ctx = c.getContext('2d');

  R = new Random();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, c.width, c.height);
}

function draw() {
  let amountOfLines = Math.ceil(R.r() * 3);
  let color = "#" + ("000000" + Math.floor(R.random_dec() * 16777215).toString(16)).slice(-6);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = color;
  ctx.lineWidth = c.width * 0.05;

  for (let i = 0; i < amountOfLines; i++) {
    let startX = c.width * R.random_dec();
    let startY = c.height * R.random_dec();
    let endX = c.width * R.random_dec();
    let endY = c.height * R.random_dec();

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  ctx.strokeRect(0, 0, c.width, c.height);

  window.rendered = c;
}

setup();
draw();
