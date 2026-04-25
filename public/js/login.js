document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const payload = Object.fromEntries(formData.entries());

  try {
    const result = await api("/api/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    csrfToken = null;
    await loadCurrentUser();

    writeJson("login-output", result);
  } catch (error) {
    writeJson("login-output", { error: error.message });
  }
});
