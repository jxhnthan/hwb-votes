// Generate a unique device ID based on browser characteristics
export function getDeviceId() {
  // Check if we already have a device ID stored
  let deviceId = localStorage.getItem('deviceId');
  
  if (deviceId) {
    return deviceId;
  }
  
  // Generate new device ID based on browser fingerprint
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    screenResolution: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport: 'ontouchstart' in window,
    vendor: navigator.vendor || '',
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
  
  // Create a hash from the fingerprint
  const fingerprintString = JSON.stringify(fingerprint);
  
  // Simple hash function (for production, use a proper crypto library)
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and add timestamp for uniqueness
  deviceId = Math.abs(hash).toString(36) + '-' + Date.now().toString(36);
  
  // Store for future use
  localStorage.setItem('deviceId', deviceId);
  
  return deviceId;
}
