// Token management
export const getAuthToken = () => localStorage.getItem('access_token');
export const setAuthToken = (token) => localStorage.setItem('access_token', token);
export const removeAuthToken = () => localStorage.removeItem('access_token');

const apiBase = import.meta.env.VITE_API_URL;

async function authFetch(path, options = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function analyzeCode({ code, language, mode = "full", instruction = "", projectId, fileId }) {
  const headers = { "Content-Type": "application/json" };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body = { code, language, mode, instruction };
  if (projectId) body.project_id = projectId;
  if (fileId) body.file_id = fileId;

  const response = await fetch(`${apiBase}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
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

  const response = await fetch(`${apiBase}/auth/login`, {
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
  const response = await fetch(`${apiBase}/auth/signup`, {
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

  const response = await fetch(`${apiBase}/auth/me`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to get current user");
  return response.json();
}

export function logout() {
  removeAuthToken();
}

// Profile
export const getProfile = () => authFetch('/profile/');
export const updateProfile = (data) => authFetch('/profile/', { method: 'PUT', body: JSON.stringify(data) });

// History
export const getHistory = () => authFetch('/history/');

// Projects
export const getProjects = () => authFetch('/projects/');
export const createProject = (data) => authFetch('/projects/', { method: 'POST', body: JSON.stringify(data) });
export const getProject = (id) => authFetch(`/projects/${id}`);

// Files
export const getProjectFiles = (projectId) => authFetch(`/projects/${projectId}/files`);
export const createFile = (projectId, data) => authFetch(`/projects/${projectId}/create-file`, { method: 'POST', body: JSON.stringify(data) });
export const saveFile = (projectId, fileId, data) => authFetch(`/projects/${projectId}/files/${fileId}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFile = (projectId, fileId) => authFetch(`/projects/${projectId}/files/${fileId}`, { method: 'DELETE' });
export const downloadFile = async (projectId, fileId) => {
  const token = getAuthToken();
  const res = await fetch(`${apiBase}/projects/${projectId}/files/${fileId}/download`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : 'file';
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportZip = async (projectId, projectName = 'project') => {
  const token = getAuthToken();
  const res = await fetch(`${apiBase}/projects/${projectId}/export-zip`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${projectName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getProjectActivity = (projectId) => authFetch(`/projects/${projectId}/history`);

export async function uploadFile(projectId, file) {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${apiBase}/projects/${projectId}/upload-file`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

