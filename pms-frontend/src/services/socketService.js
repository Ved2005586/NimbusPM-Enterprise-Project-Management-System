import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/api/ws';

/**
 * Thin wrapper around a single shared STOMP client. Components subscribe to
 * topics they care about (project task updates, task comments, personal
 * notifications) and unsubscribe on unmount; the underlying connection is
 * reused across the app.
 */
class SocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.pendingCallbacks = [];
  }

  connect(onConnected) {
    // Already fully connected — safe to subscribe immediately.
    if (this.client?.connected) {
      onConnected?.();
      return;
    }

    // A connection attempt is already in flight (e.g. another component
    // mounted first) — queue this callback rather than firing it early.
    // `client.active` just means "activation was requested", not
    // "handshake complete", so checking it here would let callers try to
    // subscribe before the STOMP CONNECT frame actually arrives.
    if (this.client?.active) {
      this.pendingCallbacks.push(onConnected);
      return;
    }

    const token = localStorage.getItem('accessToken');

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 4000,
      onConnect: () => {
        onConnected?.();
        const queued = this.pendingCallbacks;
        this.pendingCallbacks = [];
        queued.forEach((cb) => cb?.());
      },
      onStompError: (frame) => console.error('STOMP error', frame.headers?.message),
    });

    this.client.activate();
  }

  subscribe(topic, callback) {
    if (!this.client?.connected) return null;
    const sub = this.client.subscribe(topic, (message) => {
      try {
        callback(JSON.parse(message.body));
      } catch {
        callback(message.body);
      }
    });
    this.subscriptions.set(topic, sub);
    return sub;
  }

  unsubscribe(topic) {
    this.subscriptions.get(topic)?.unsubscribe();
    this.subscriptions.delete(topic);
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.client?.deactivate();
  }
}

export default new SocketService();
