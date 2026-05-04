let SESSION_DURATION = 60 * 60 * 1000; // fallback default (1 hour)

/**
 * Convert "HH:MM" → milliseconds
 */
export const parseSessionExpiry = (timeStr) => {
  if (!timeStr) return SESSION_DURATION;

  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours * 60 + minutes) * 60 * 1000;
};

/**
 * Set session duration dynamically
 */
export const setSessionDuration = (timeStr) => {
  SESSION_DURATION = parseSessionExpiry(timeStr);
};

/**
 * Get current session duration
 */
export const getSessionDuration = () => SESSION_DURATION;

/**
 * Update expiry in localStorage
 */
export const updateSessionExpiry = () => {
  const expiryTime = Date.now() + SESSION_DURATION;
  localStorage.setItem("sessionExpiry", expiryTime.toString());
};