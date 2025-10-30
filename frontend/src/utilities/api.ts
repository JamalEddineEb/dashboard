export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: 'include', 
    mode: "cors",
    ...options,
  });  

  console.log(response.status ,"haha");


  if (response.status === 401 || response.status === 403) {
    const currentUrl = window.location.href;
    console.log(currentUrl,"hoho");
    
    const loginUrl = `http://localhost:8080/api/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
    throw new Error('Unauthorized. Redirecting to login.');
  }

  if (!response.ok) {
    throw new Error('Request failed');
  }

  return response.json();
}
