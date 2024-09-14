// src/index.js
import "./style.css";
import "./note-form.js";
import "./note-item.js";
import { notesData as sampleNotes } from "./sample-notes.js";

const noteFormElement = document.querySelector("note-form");
const notesListElement = document.querySelector("#notesList");

// Periksa apakah noteFormElement benar-benar ada
if (noteFormElement) {
  const noteForm = noteFormElement.shadowRoot.querySelector("#noteForm");
  const noteTitleInput = noteFormElement.shadowRoot.querySelector("#noteTitle");
  const noteBodyInput = noteFormElement.shadowRoot.querySelector("#noteBody");

  let notes = [];

  function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
    } else {
      notes = [...sampleNotes];
    }
  }

  function renderNotes() {
    notesListElement.innerHTML = "";
    notes.forEach((note) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("title", note.title);
      noteElement.setAttribute("body", note.body);
      noteElement.setAttribute("data-id", note.id);

      noteElement.addEventListener("delete-note", (e) => {
        notes = notes.filter((n) => n.id !== e.detail.id);
        renderNotes();
        saveNotesToLocalStorage();
      });

      noteElement.addEventListener("edit-note", (e) => {
        const id = e.detail.id;
        const editedNote = notes.find((n) => n.id === id);
        if (editedNote) {
          editedNote.title = e.detail.title;
          editedNote.body = e.detail.body;
          renderNotes();
          saveNotesToLocalStorage();
        }
      });

      notesListElement.append(noteElement);
    });
  }

  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newNote = {
      id: Date.now().toString(),
      title: noteTitleInput.value,
      body: noteBodyInput.value,
    };
    notes.push(newNote);
    renderNotes();
    saveNotesToLocalStorage();
    noteForm.reset();
  });

  loadNotesFromLocalStorage();
  renderNotes();
} else {
  console.error("note-form element not found");
}
