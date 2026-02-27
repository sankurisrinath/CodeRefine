// Token management
export const getAuthToken = () => localStorage.getItem('access_token');
export const setAuthToken = (token) => localStorage.setItem('access_token', token);
export const removeAuthToken = () => localStorage.removeItem('access_token');

export async function analyzeCode({ code, language, mode = "full", instruction = "" }) {
  const headers = { "Content-Type": "application/json" };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, language, mode, instruction })
  });

  if (!response.ok) {
    let errorMessage = "Analysis failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.explanation || errorData.detail || errorMessage;
    } catch {
      // response body wasn't JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  setAuthToken(data.access_token);
  return data;
}

export async function signup(username, email, password, fullName) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, full_name: fullName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Signup failed");
  }

  const data = await response.json();
  setAuthToken(data.access_token);
  return data;
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) throw new Error("No token");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to get current user");
  return response.json();
}

export function logout() {
  removeAuthToken();
}

