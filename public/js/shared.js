let csrfToken = null;

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const method = (options.method || "GET").toUpperCase();

  if (method !== "GET" && csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(path, {
    headers,
    credentials: "same-origin",
    ...options
  });

  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  const body = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === "object" && body && body.error ? body.error : response.statusText;
    throw new Error(message);
  }

  return body;
}

async function loadCurrentUser() {
  const data = await api("/api/me");

  if (data.user && !csrfToken) {
    const tokenData = await api("/api/csrf-token");
    csrfToken = tokenData.csrfToken;
  }

  return data.user;
}

function writeJson(elementId, value) {
  const target = document.getElementById(elementId);

  if (target) {
    target.textContent = JSON.stringify(value, null, 2);
  }
}
