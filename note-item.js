class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "body", "data-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot) {
      if (name === "title") {
        const titleElement = this.shadowRoot.querySelector(".title");
        if (titleElement) {
          titleElement.textContent = newValue || "No Title";
        }
      }
      if (name === "body") {
        const bodyElement = this.shadowRoot.querySelector(".body");
        if (bodyElement) {
          bodyElement.textContent = newValue || "No Body";
        }
      }
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "No Title";
    const body = this.getAttribute("body") || "No Body";

    this.shadowRoot.innerHTML = `
      <style>
        .note-item {
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .note-item:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .title {
          font-size: 1.4em;
          margin-bottom: 8px;
          color: #333;
        }
        .body {
          font-size: 1em;
          color: #666;
        }
        .delete-btn, .edit-btn {
          position: absolute;
          top: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
        }
        .delete-btn {
          right: 8px;
          color: #e74c3c;
        }
        .delete-btn:hover {
          color: #c0392b;
        }
        .edit-btn {
          right: 36px;
          color: #3498db;
        }
        .edit-btn:hover {
          color: #2980b9;
        }
      </style>
      <div class="note-item">
        <button class="edit-btn">✎</button>
        <button class="delete-btn">✕</button>
        <div class="title">${title}</div>
        <div class="body">${body}</div>
      </div>
    `;

    this.shadowRoot
      .querySelector(".delete-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteNote();
      });

    this.shadowRoot
      .querySelector(".edit-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        this.editNote();
      });
  }

  editNote() {
    const id = this.getAttribute("data-id");
    const title = prompt("Edit title:", this.getAttribute("title"));
    const body = prompt("Edit body:", this.getAttribute("body"));
    if (title !== null && body !== null) {
      this.setAttribute("title", title);
      this.setAttribute("body", body);
    }
  }

  deleteNote() {
    this.dispatchEvent(
      new CustomEvent("delete-note", {
        detail: { id: this.getAttribute("data-id") },
        bubbles: true,
      })
    );
  }
}

customElements.define("note-item", NoteItem);
