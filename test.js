const addNoteBtn = document.getElementById("addNoteBtn");
const noteInput = document.getElementById("noteInput");
const notesContainer = document.getElementById("notesContainer");
const noteColor = document.getElementById("noteColor");
const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const app = document.querySelector(".app");
const popupModal = document.getElementById("popupModal");
const popupMessage = document.getElementById("popupMessage");

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    app.classList.add("dark-theme");
  }

  const savedNotes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  savedNotes.forEach(note => {
    if (note.text?.trim()) {
      createNote(note.text, note.color);
    }
  });
});

if (toggleThemeBtn) {
  toggleThemeBtn.addEventListener("click", () => {
    app.classList.toggle("dark-theme");
    const theme = app.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });
}

addNoteBtn.addEventListener("click", () => {
  const text = noteInput.value.trim();
  const color = noteColor.value;

  if (text) {
    createNote(text, color);
    saveNote(text, color);
    noteInput.value = "";
    showPopup("Note added successfully!");
  } else {
    showPopup("Please enter a note.");
  }
});

function createNote(text, color) {
  const note = document.createElement("div");
  note.className = "note";
  note.style.backgroundColor = color;

  note.innerHTML = `
    <div class="note-header">
      <button class="menu-btn">⋮</button>
      <div class="note-menu hidden">
        <ul>
          <li class="menu-edit">Edit</li>
          <li class="menu-pin">Pin</li>
          <li class="menu-delete">Delete</li>
        </ul>
      </div>
    </div>
    <p class="note-text">${text}</p>
  `;

  notesContainer.appendChild(note);

  const menuBtn = note.querySelector(".menu-btn");
  const menu = note.querySelector(".note-menu");

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".note-menu").forEach(m => m.classList.add("hidden"));
    menu.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!note.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  menu.querySelector(".menu-edit").addEventListener("click", () => {
    const newText = showPopup("Edit your note:", text);
    if (newText?.trim()) {
      note.querySelector(".note-text").innerText = newText.trim();
      updateNoteInStorage(text, newText.trim());
      showPopup("Note updated!");
    }
    menu.classList.add("hidden");
  });

  menu.querySelector(".menu-pin").addEventListener("click", () => {
    notesContainer.prepend(note);
    showPopup("Note pinned!");
    menu.classList.add("hidden");
  });

  menu.querySelector(".menu-delete").addEventListener("click", () => {
    note.remove();
    removeNoteFromStorage(text);
    showPopup("Note deleted.");
  });
}

function saveNote(text, color) {
  const notes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  notes.push({ text, color });
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function removeNoteFromStorage(text) {
  let notes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  notes = notes.filter(note => note.text !== text);
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function updateNoteInStorage(oldText, newText) {
  let notes = JSON.parse(localStorage.getItem("stickyNotes")) || [];
  const index = notes.findIndex(note => note.text === oldText);
  if (index !== -1) {
    notes[index].text = newText;
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }
}

function showPopup(message) {
  popupMessage.textContent = message;
  popupModal.style.display = "flex";
}

function closePopup() {
  popupModal.style.display = "none";
}
