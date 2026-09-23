/**
 * Real-time SSE (Server-Sent Events) Service
 * Manages singleton connection to the public events stream and dispatches events.
 */

const getSseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    const base = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
    return `${base}/api/public/events`;
  }
  if (typeof window !== 'undefined' && window.location.port === '5173') {
    return 'http://localhost:5000/api/public/events';
  }
  return '/api/public/events';
};

class SseService {
  constructor() {
    this.eventSource = null;
    this.listeners = new Map(); // eventName -> Set of callback functions
    this.statusListeners = new Set();
    this.status = 'disconnected'; // 'connecting' | 'connected' | 'disconnected'
    this.reconnectTimer = null;
  }

  connect() {
    if (this.eventSource && (this.status === 'connected' || this.status === 'connecting')) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.EventSource === 'undefined') {
      console.warn('EventSource is not supported in this environment');
      return;
    }

    const url = getSseUrl();
    this.updateStatus('connecting');

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        this.updateStatus('connected');
      };

      this.eventSource.onerror = (err) => {
        console.warn('SSE connection issue, reconnecting...', err);
        this.updateStatus('disconnected');
        // Native EventSource will attempt reconnect, but we ensure state is tracked
      };

      // Listen to registered event types
      const knownEvents = ['JobCreated', 'JobUpdated', 'JobDeleted', 'NewApplicationReceived'];
      knownEvents.forEach((evtName) => {
        this.eventSource.addEventListener(evtName, (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`📡 [SSE Client] Received event ${evtName}:`, data);
            this.dispatch(evtName, data);
          } catch (e) {
            console.error(`Error parsing SSE data for ${evtName}:`, e);
          }
        });
      });

      // Also listen to general message for fallback
      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            console.log(`📡 [SSE Client Fallback] Received message type ${data.type}:`, data);
            this.dispatch(data.type, data);
          }
        } catch (e) {
          // ignore
        }
      };
    } catch (e) {
      console.error('Failed to initialize EventSource:', e);
      this.updateStatus('disconnected');
    }
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((fn) => {
      try {
        fn(newStatus);
      } catch (err) {
        console.error('Status listener error:', err);
      }
    });
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    // If eventSource is active and this is a custom event not in knownEvents, attach it
    const knownEvents = ['JobCreated', 'JobUpdated', 'JobDeleted', 'NewApplicationReceived'];
    if (this.eventSource && !knownEvents.includes(eventName)) {
      this.eventSource.addEventListener(eventName, (event) => {
        try {
          const data = JSON.parse(event.data);
          this.dispatch(eventName, data);
        } catch (e) {
          // ignore
        }
      });
    }

    // Auto connect if not connected
    if (!this.eventSource || this.status === 'disconnected') {
      this.connect();
    }

    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }


  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.status);
    return () => this.statusListeners.delete(callback);
  }

  dispatch(eventName, data) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in SSE listener for ${eventName}:`, err);
        }
      });
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.updateStatus('disconnected');
  }
}

export const sseService = new SseService();
export default sseService;
