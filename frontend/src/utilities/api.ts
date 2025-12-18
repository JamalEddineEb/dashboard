export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: "include",
    mode: "cors",
    ...options,
  });

  if (response.status === 401 || response.status === 403) {
    window.location.href = "/auth";
    throw new Error("Unauthorized. Redirecting to login.");
  }

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}
