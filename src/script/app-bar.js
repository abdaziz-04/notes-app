class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .app-bar {
          background-color: #007bff;
          color: white;
          padding: 16px;
          text-align: center;
          font-size: 1.5em;
        }
      </style>
      <div class="app-bar">
        <h1>Notes App</h1>
      </div>
    `;
  }
}

customElements.define("app-bar", AppBar);
