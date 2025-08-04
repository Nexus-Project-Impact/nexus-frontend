
// savar o token
export function saveToken(token) {
  localStorage.setItem('token', token); // aqui está guardando no localStorage
}

// pegar o token
export function getToken() {
  return localStorage.getItem('token');
}

// removar o token
export function removeToken() {
  localStorage.removeItem('token');
}

// decocifica o token
export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1]; // pega a parte do meio do jwt
    return JSON.parse(atob(payload)); // transforma a parte do meio em um objeto JSON
  } catch {
    return null;
  }
}

// função se o token expirou
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true; 
  const now = Date.now() / 1000; // aqui está comparando com o tempo atual em segundos
  // verifica se o tempo de expiração do token é menor que o tempo atual
  return decoded.exp < now; 
}