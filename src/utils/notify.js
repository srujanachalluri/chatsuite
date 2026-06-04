// Local (client-side) notifications for new messages while the tab is hidden.
// NOTE: This only fires while the app is running in a background tab. Delivering
// notifications when the app is fully closed requires server push (FCM + a Cloud
// Function) — that's a follow-up, not included here.

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission === 'default') {
    try { return await Notification.requestPermission(); } catch { return 'denied'; }
  }
  return Notification.permission;
}

export async function showNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  if (!document.hidden) return; // only notify when the tab isn't visible
  const options = {
    body: (body || '').slice(0, 140),
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'chatsuite-message',
    renotify: true,
  };
  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch {
    /* ignore */
  }
}
