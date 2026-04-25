function addText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  parent.appendChild(element);
  return element;
}

function noteCard(note) {
  const card = document.createElement("article");
  card.className = "note-card";

  addText(card, "h3", note.title);
  addText(
    card,
    "p",
    `Owner: ${note.ownerUsername} | ID: ${note.id} | Pinned: ${note.pinned}`,
    "note-meta"
  );
  addText(card, "div", note.body, "note-body");

  return card;
}

async function loadNotes(search) {
  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  const result = await api(`/api/notes?${query.toString()}`);
  const notesList = document.getElementById("notes-list");

  notesList.textContent = "";

  for (const note of result.notes) {
    notesList.appendChild(noteCard(note));
  }
}

(async function bootstrapNotes() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("notes-list").textContent = "Please log in first.";
      return;
    }

    document.getElementById("notes-owner-id").value = user.id;
    document.getElementById("create-owner-id").value = user.id;

    await loadNotes("");
  } catch (error) {
    document.getElementById("notes-list").textContent = error.message;
  }
})();

document.getElementById("search-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await loadNotes(formData.get("search"));
});

document.getElementById("create-note-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const payload = {
    title: formData.get("title"),
    body: formData.get("body"),
    pinned: formData.get("pinned") === "on"
  };

  await api("/api/notes", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  await loadNotes("");
  event.currentTarget.reset();

  const user = await loadCurrentUser();
  document.getElementById("create-owner-id").value = user.id;
});
