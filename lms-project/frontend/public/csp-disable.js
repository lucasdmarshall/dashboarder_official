// This script attempts to disable CSP at runtime
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: string => string,
    createScriptURL: string => string,
    createScript: string => string
  });
}

// Try to remove CSP headers if needed
try {
  // Another approach to disable CSP
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';";
  document.head.appendChild(meta);
  
  console.log('CSP override attempted');
} catch (e) {
  console.error('Failed to override CSP:', e);
}
