import { useEffect, useRef } from 'react';
import socketService from '../services/socketService';

/**
 * Subscribes to a STOMP topic for the lifetime of the calling component.
 * Pass a stable callback (or one wrapped in useCallback) to avoid
 * resubscribing on every render.
 */
export default function useWebSocket(topic, onMessage, enabled = true) {
  const callbackRef = useRef(onMessage);
  callbackRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !topic) return undefined;

    let subscribed = false;

    socketService.connect(() => {
      socketService.subscribe(topic, (payload) => callbackRef.current?.(payload));
      subscribed = true;
    });

    return () => {
      if (subscribed) socketService.unsubscribe(topic);
    };
  }, [topic, enabled]);
}
