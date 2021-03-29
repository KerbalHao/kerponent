c;
/*
 * @Date: 2021-03-29 16:31:41
 * @LastEditors: KerbalHao
 * @FilePath: \components\src\components\LuckyWheel\index.js
 */
class LuckyWheel extends HTMLElement {
  static get observedAttributes() {
    return ["width", "height", "src", "count"];
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `
    <canvas id='luckyWheel></canvas>`;
  }
  connectedCallback() {

  }
}
customElements.define("lucky-wheel", LuckyWheel);
