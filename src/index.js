import "./note-item.js"; // Import the web component
import "./app-bar.js";
import "./note-form.js";

import { notesData as sampleNotes } from "./sample-notes.js";

const noteFormElement = document.querySelector("note-form");
const notesListElement = document.querySelector("#notesList");

// Ambil elemen input dari dalam shadow DOM
const noteForm = noteFormElement.shadowRoot.querySelector("#noteForm");
const noteTitleInput = noteFormElement.shadowRoot.querySelector("#noteTitle");
const noteBodyInput = noteFormElement.shadowRoot.querySelector("#noteBody");

let notes = [];

// Fungsi untuk menyimpan catatan ke LocalStorage
function saveNotesToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Fungsi untuk memuat catatan dari LocalStorage
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

    // Event untuk menghapus catatan
    noteElement.addEventListener("delete-note", (e) => {
      notes = notes.filter((n) => n.id !== e.detail.id);
      renderNotes();
      saveNotesToLocalStorage(); // Simpan setelah menghapus
    });

    // Event untuk mengedit catatan
    noteElement.addEventListener("edit-note", (e) => {
      const id = e.detail.id;
      const editedNote = notes.find((n) => n.id === id);
      if (editedNote) {
        // Memperbarui catatan yang sudah ada
        editedNote.title = e.detail.title;
        editedNote.body = e.detail.body;
        renderNotes();
        saveNotesToLocalStorage(); // Simpan setelah pengeditan
      }
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
  saveNotesToLocalStorage(); // Simpan setelah menambahkan catatan baru
  noteForm.reset();
});

// Muat catatan dari LocalStorage saat halaman pertama kali dibuka
loadNotesFromLocalStorage();
renderNotes();
