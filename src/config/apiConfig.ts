// API Configuration helper
// Routes to the backend API on DigitalOcean (146.190.74.221:8787)

export function getApiBaseUrl(): string {
  // If running in browser
  if (typeof window !== 'undefined') {
    const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;
    
    // In dev mode, use Vite proxy
    if (isDev) {
      return '';  // Empty string means use relative /api paths (Vite proxy)
    }
    
    // In production, always use the DigitalOcean backend
    // Works for both:
    // - http://146.190.74.221:3000 (direct IP)
    // - Netlify domain (when configured to proxy to DigitalOcean)
    // - localhost:3000 (local production build)
    
    // Try to get backend URL from environment variable first
    const envBackend = (window as any).__API_BACKEND_URL;
    if (envBackend) {
      return envBackend;
    }
    
    // Default to DigitalOcean backend on port 8787
    return 'http://146.190.74.221:8787';
  }
  
  // Server-side fallback
  return 'http://localhost:8787';
}
