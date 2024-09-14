class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        input, textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        textarea {
          resize: vertical;
        }
        button {
          grid-column: span 2;
          padding: 10px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        button:hover {
          background-color: #0056b3;
        }
      </style>
      <form id="noteForm">
        <input type="text" id="noteTitle" placeholder="Title" required />
        <textarea id="noteBody" placeholder="Body" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;
  }
}

customElements.define("note-form", NoteForm);
