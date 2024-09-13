import "./note-item.js"; // Import the web component
import { notesData as sampleNotes } from "./sample-notes.js";

const notesListElement = document.querySelector("#notesList");
const noteForm = document.querySelector("#noteForm");
const noteTitleInput = document.querySelector("#noteTitle");
const noteBodyInput = document.querySelector("#noteBody");

let notes = [...sampleNotes];

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
    });
    notesListElement.append(noteElement);
  });
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newNote = {
    id: Date.now().toString(), // Simple unique ID
    title: noteTitleInput.value,
    body: noteBodyInput.value,
  };
  notes.push(newNote);
  renderNotes();
  noteForm.reset();
});

// Initial render
renderNotes();
