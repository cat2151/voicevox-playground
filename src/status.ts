let cachedRootComputedStyle: CSSStyleDeclaration | null = null;
const colorVariableCache: Record<string, string> = {};
let statusHideTimer: number | null = null;

export function showStatus(message: string, type: 'info' | 'error' | 'success') {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    if (statusHideTimer !== null) {
      clearTimeout(statusHideTimer);
      statusHideTimer = null;
    }
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    statusDiv.style.visibility = 'visible';
    statusDiv.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  }
}

export function hideStatus() {
  const statusDiv = document.getElementById('status');
  if (statusDiv) {
    statusDiv.textContent = '';
    statusDiv.className = 'status';
    statusDiv.style.visibility = 'hidden';
    statusDiv.setAttribute('aria-live', 'polite');
  }
  if (statusHideTimer !== null) {
    clearTimeout(statusHideTimer);
    statusHideTimer = null;
  }
}

export function scheduleHideStatus(delayMs: number) {
  if (statusHideTimer !== null) {
    clearTimeout(statusHideTimer);
  }
  statusHideTimer = window.setTimeout(() => {
    statusHideTimer = null;
    hideStatus();
  }, delayMs);
}

export function invalidateColorVariableCache() {
  cachedRootComputedStyle = null;
  Object.keys(colorVariableCache).forEach((key) => delete colorVariableCache[key]);
}

export function getColorVariable(name: string, fallback: string) {
  if (!cachedRootComputedStyle) {
    cachedRootComputedStyle = getComputedStyle(document.documentElement);
  }

  const cached = colorVariableCache[name];
  if (cached !== undefined && cached !== '') {
    return cached;
  }

  const value = cachedRootComputedStyle.getPropertyValue(name).trim() || fallback;
  colorVariableCache[name] = value;
  return value;
}
