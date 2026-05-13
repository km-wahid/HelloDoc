// API Configuration helper
// In production, uses the same host with port 8787
// In development with Vite, uses the proxy (/api)

export function getApiBaseUrl(): string {
  // If running in browser
  if (typeof window !== 'undefined') {
    const isDev = import.meta.env.DEV;
    
    // In dev mode, use Vite proxy
    if (isDev) {
      return '';  // Empty string means use relative /api paths (Vite proxy)
    }
    
    // In production, use absolute URL to backend
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:8787`;
  }
  
  // Server-side fallback
  return 'http://localhost:8787';
}
