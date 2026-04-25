function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  row.appendChild(cell);
}

(async function bootstrapAdmin() {
  try {
    const user = await loadCurrentUser();

    if (!user) {
      document.getElementById("admin-warning").textContent = "Please log in first.";
      return;
    }

    if (user.role !== "admin") {
      document.getElementById("admin-warning").textContent = "Admin access required.";
      return;
    }

    document.getElementById("admin-warning").textContent = "Authenticated as admin.";

    const result = await api("/api/admin/users");
    const tableBody = document.getElementById("admin-users");

    tableBody.textContent = "";

    for (const entry of result.users) {
      const row = document.createElement("tr");

      addCell(row, entry.id);
      addCell(row, entry.username);
      addCell(row, entry.role);
      addCell(row, entry.displayName);
      addCell(row, entry.noteCount);

      tableBody.appendChild(row);
    }
  } catch (error) {
    document.getElementById("admin-warning").textContent = error.message;
  }
})();
