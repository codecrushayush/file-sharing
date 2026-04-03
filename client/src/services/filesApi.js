import { api, getApiBaseUrl, getStoredToken } from "./api.js";

async function blobErrorMessage(err) {
  if (err.response?.data instanceof Blob) {
    try {
      const text = await err.response.data.text();
      const j = JSON.parse(text);
      if (j?.message) return j.message;
    } catch {
      /* ignore */
    }
  }
  return err.message || "Request failed";
}

function triggerBlobDownload(response, fallbackName) {
  const blob = response.data;
  const disposition = response.headers["content-disposition"] || "";
  let filename = fallbackName || "download";
  const star = /filename\*=UTF-8''([^;\s]+)/i.exec(disposition);
  const quoted = /filename="([^"]+)"/i.exec(disposition);
  if (star) {
    try {
      filename = decodeURIComponent(star[1]);
    } catch {
      filename = star[1];
    }
  } else if (quoted) {
    filename = quoted[1];
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function listFiles() {
  const { data } = await api.get("/files");
  return data;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getStoredToken();
  const res = await fetch(`${getApiBaseUrl()}/files/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }
  return data;
}

export async function deleteFile(id) {
  const { data } = await api.delete(`/files/${id}`);
  return data;
}

export async function shareFile(id) {
  const { data } = await api.post(`/files/${id}/share`);
  return data;
}

export async function downloadOwnedFile(id, fallbackName) {
  try {
    const response = await api.get(`/files/${id}/download`, {
      responseType: "blob",
    });
    triggerBlobDownload(response, fallbackName);
  } catch (err) {
    throw new Error(await blobErrorMessage(err));
  }
}

export async function getSharedMetadata(token) {
  const { data } = await api.get(`/share/${token}`);
  return data;
}

export async function downloadSharedFile(token, fallbackName) {
  try {
    const response = await api.get(`/share/${token}/download`, {
      responseType: "blob",
    });
    triggerBlobDownload(response, fallbackName);
  } catch (err) {
    throw new Error(await blobErrorMessage(err));
  }
}

export function buildSharePageUrl(token) {
  if (typeof window === "undefined") return `/share/${token}`;
  return `${window.location.origin}/share/${token}`;
}
