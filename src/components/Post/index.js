/*
 * @Date: 2021-03-29 15:15:36
 * @LastEditors: KerbalHao
 * @FilePath: \components\src\components\Post\index.js
 */
/*
 * @Date: 2021-03-26 16:48:36
 * @LastEditors: KerbalHao
 * @FilePath: \pratice\script.js
 */

function calculateBrightness(red, green, blue) {
  return (
    Math.sqrt(red * red * 0.299 + green * green + 0.587 + blue * blue * 0.114) /
    100
  );
}
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.y = 0;
    this.x = Math.random() * this.width;
    this.size = Math.random() * 1.5 + 1;
    this.velocity = Math.random() * 1.5;
    this.speed = 0;
    this.position1 = Math.floor(this.y);
    this.position2 = Math.floor(this.x);
  }
  update(mappingArray) {
    this.position1 = Math.floor(this.y);
    this.position2 = Math.floor(this.x);
    if (
      mappingArray[this.position1] == undefined ||
      mappingArray[this.position1][this.position2] == undefined
    ) {
      console.log(this.position1, this.position2);
    }

    this.speed = mappingArray[this.position1][this.position2][0];
    let movement = 2.5 - this.speed + this.velocity;
      this.y += movement * Math.sin(this.speed);
      this.x += movement * Math.sin(this.speed);

    if (this.y > this.height) {
      this.y = 0;
      this.x = Math.random() * this.width;
    }
    if (this.x > this.width) {
      this.x = 0;
      this.y = Math.random() * this.height;
    }
  }
  draw(ctx, mappingArray) {
    ctx.beginPath();
    ctx.fillStyle = mappingArray[this.position1][this.position2][1];
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 图片以像素形式不断绘制
// 接收 画布宽度，画布高度，图片连接（本地）和像素数量
// TODO: 增加 像素掉落方式，像素颜色设置
export default class Post extends HTMLElement {
  static get observedAttributes() {
    return ["width", "height", "src", "count"];
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
      <canvas id='canvas1'></canvas>
    `;
  }
  get width() {
    return +this.getAttribute("width");
  }
  get height() {
    return +this.getAttribute("height");
  }
  get src() {
    return this.getAttribute("src");
  }
  get count() {
    return +this.getAttribute("count");
  }

  init(count, particlesArray) {
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle(this.width, this.height));
    }
  }

  connectedCallback() {
    const canvas = this.shadowRoot.getElementById("canvas1");
    const ctx = canvas.getContext("2d");

    const image1 = new Image();
    image1.src = this.src;
    canvas.width = this.width;
    canvas.height = this.height;
    let that = this;
    image1.addEventListener("load", function () {
      const numberOfParticles = that.count;
      const particlesArray = [];
      ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
      let scannedImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let mappingArray = [];

      for (let y = 0; y < canvas.height; y++) {
        let row = [];
        for (let x = 0; x < canvas.width; x++) {
          let red = scannedImg.data[y * 4 * scannedImg.width + x * 4];
          let green = scannedImg.data[y * 4 * scannedImg.width + x * 4 + 1];
          let blue = scannedImg.data[y * 4 * scannedImg.width + x * 4 + 2];
          let brightness = calculateBrightness(red, green, blue);
          let rgb = `rgb(${red},${green},${blue})`;
          const cell = [brightness, rgb];
          row.push(cell);
        }
        mappingArray.push(row);
      }

      function animate() {
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = `rgb(0,0,0)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update(mappingArray);
          ctx.globalAlpha = particlesArray[i].speed / 2;
          particlesArray[i].draw(ctx, mappingArray);
        }
        requestAnimationFrame(animate);
      }
      that.init(numberOfParticles, particlesArray);
      animate();
    });
  }

}

customElements.define("my-poster", Post);
