import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_KEY = 'biometric_logs';
const MAX_LOGS = 200;

export type TelemetryEvent = {
  id: string;
  name: string;
  timestamp: number;
  details?: Record<string, any>;
};

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export async function logEvent(name: string, details?: Record<string, any>) {
  try {
    const raw = await AsyncStorage.getItem(LOG_KEY);
    const logs: TelemetryEvent[] = raw ? JSON.parse(raw) : [];
    const entry: TelemetryEvent = { id: genId(), name, timestamp: Date.now(), details };
    logs.unshift(entry);
    if (logs.length > MAX_LOGS) logs.splice(MAX_LOGS);
    await AsyncStorage.setItem(LOG_KEY, JSON.stringify(logs));
    return entry;
  } catch (e) {
    // best-effort logging
    console.warn('Telemetry log failed', e);
    return null;
  }
}

export async function getEvents(limit = 100): Promise<TelemetryEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(LOG_KEY);
    const logs: TelemetryEvent[] = raw ? JSON.parse(raw) : [];
    return logs.slice(0, limit);
  } catch (e) {
    console.warn('Telemetry read failed', e);
    return [];
  }
}

export async function clearEvents() {
  try {
    await AsyncStorage.removeItem(LOG_KEY);
  } catch (e) {
    console.warn('Telemetry clear failed', e);
  }
}

export default { logEvent, getEvents, clearEvents };
