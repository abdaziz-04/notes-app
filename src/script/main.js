import "../style.css";
import "./note-item.js";
import "./app-bar.js";
import "./note-form.js";

const noteFormElement = document.querySelector("note-form");
const notesListElement = document.querySelector("#notesList");
const loadingIndicator = document.querySelector("#loadingIndicator");

// Ambil elemen input dari dalam shadow DOM
const noteForm = noteFormElement.shadowRoot.querySelector("#noteForm");
const noteTitleInput = noteFormElement.shadowRoot.querySelector("#noteTitle");
const noteBodyInput = noteFormElement.shadowRoot.querySelector("#noteBody");

let notes = [];

// Fungsi untuk menampilkan loading indicator
function showLoading() {
  loadingIndicator.style.display = "block";
}

// Fungsi untuk menyembunyikan loading indicator
function hideLoading() {
  loadingIndicator.style.display = "none";
}

// Fungsi untuk memuat catatan dari API
async function loadNotesFromAPI() {
  showLoading();
  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes");
    const result = await response.json();

    if (result.status === "success") {
      notes = result.data; // Ambil data catatan dari respons API
      renderNotes();
    } else {
      console.error("Error fetching notes:", result.message);
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
  } finally {
    hideLoading(); // Sembunyikan loading indicator setelah operasi selesai
  }
}

// Fungsi untuk menambahkan catatan baru ke API
async function addNoteToAPI(note) {
  showLoading();
  try {
    const response = await fetch("https://notes-api.dicoding.dev/v2/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: note.title,
        body: note.body,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      notes.push(result.data); // Tambah data catatan baru ke daftar notes
      renderNotes();
    } else {
      console.error("Error adding note:", result.message);
    }
  } catch (error) {
    console.error("Error adding note:", error);
  } finally {
    hideLoading(); // Sembunyikan loading indicator setelah operasi selesai
  }
}

// Fungsi untuk menghapus catatan dari API
async function deleteNoteFromAPI(id) {
  showLoading();
  try {
    const response = await fetch(
      `https://notes-api.dicoding.dev/v2/notes/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      notes = notes.filter((note) => note.id !== id); // Filter catatan yang dihapus
      renderNotes();
    } else {
      console.error("Error deleting note:", result.message);
    }
  } catch (error) {
    console.error("Error deleting note:", error);
  } finally {
    hideLoading(); // Sembunyikan loading indicator setelah operasi selesai
  }
}

// Fungsi untuk menampilkan catatan
function renderNotes() {
  notesListElement.innerHTML = "";
  notes.forEach((note) => {
    const noteElement = document.createElement("note-item");
    noteElement.setAttribute("title", note.title);
    noteElement.setAttribute("body", note.body);
    noteElement.setAttribute("data-id", note.id);

    // Event untuk menghapus catatan
    noteElement.addEventListener("delete-note", (e) => {
      const id = e.detail.id;
      deleteNoteFromAPI(id);
    });

    notesListElement.append(noteElement);
  });
}

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newNote = {
    title: noteTitleInput.value,
    body: noteBodyInput.value,
  };
  addNoteToAPI(newNote); // Menggunakan API untuk menambahkan catatan
  noteForm.reset(); // Reset form setelah submit
});

// Muat catatan dari API saat halaman pertama kali dibuka
loadNotesFromAPI();
