export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  namespace: string;
  context: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export type LoggerSink = (entry: LogEntry) => void;

export interface LoggerOptions {
  name?: string;
  level?: LogLevel;
  context?: Record<string, unknown>;
  sinks?: LoggerSink[];
  fileSink?: LoggerSink;
  includeTimestamp?: boolean;
}

export interface Logger {
  debug(message: string, metadata?: Record<string, unknown>): void;
  info(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  child(context: Record<string, unknown>, childName?: string): Logger;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const defaultConsoleSink: LoggerSink = (entry) => {
  const payload = {
    ...entry.context,
    ...(entry.metadata ?? {}),
    msg: entry.message,
    ts: entry.timestamp,
    ns: entry.namespace,
  };
  switch (entry.level) {
    case 'debug':
      console.debug(payload);
      break;
    case 'info':
      console.info(payload);
      break;
    case 'warn':
      console.warn(payload);
      break;
    case 'error':
      console.error(payload);
      break;
    default:
      console.log(payload);
  }
};

const buildNamespace = (name?: string): string => {
  return name ?? 'app';
};

const createEmitter = (
  level: LogLevel,
  options: Required<Pick<LoggerOptions, 'includeTimestamp'>> & {
    namespace: string;
    context: Record<string, unknown>;
    sinks: LoggerSink[];
    threshold: LogLevel;
  }
) => {
  const thresholdPriority = LEVEL_PRIORITY[options.threshold];
  const sinks = options.sinks;
  return (message: string, metadata?: Record<string, unknown>) => {
    if (LEVEL_PRIORITY[level] < thresholdPriority) {
      return;
    }
    const entry: LogEntry = {
      level,
      message,
      timestamp: options.includeTimestamp ? new Date().toISOString() : '',
      namespace: options.namespace,
      context: options.context,
      metadata,
    };
    sinks.forEach((sink) => sink(entry));
  };
};

export const createLogger = (options: LoggerOptions = {}): Logger => {
  const namespace = buildNamespace(options.name);
  const context = { ...(options.context ?? {}) };
  const sinks: LoggerSink[] = [defaultConsoleSink, ...(options.sinks ?? [])];
  if (options.fileSink) {
    sinks.push(options.fileSink);
  }
  const threshold = options.level ?? 'info';
  const includeTimestamp = options.includeTimestamp ?? true;

  const emitters = {
    debug: createEmitter('debug', { namespace, context, sinks, threshold, includeTimestamp }),
    info: createEmitter('info', { namespace, context, sinks, threshold, includeTimestamp }),
    warn: createEmitter('warn', { namespace, context, sinks, threshold, includeTimestamp }),
    error: createEmitter('error', { namespace, context, sinks, threshold, includeTimestamp }),
  };

  const child = (childContext: Record<string, unknown>, childName?: string): Logger => {
    const inheritedCustomSinks = sinks.filter(
      (sink) => sink !== defaultConsoleSink && sink !== options.fileSink
    );
    return createLogger({
      name: childName ? `${namespace}:${childName}` : namespace,
      level: threshold,
      includeTimestamp,
      context: { ...context, ...childContext },
      sinks: inheritedCustomSinks,
      fileSink: options.fileSink,
    });
  };

  return {
    debug: emitters.debug,
    info: emitters.info,
    warn: emitters.warn,
    error: emitters.error,
    child,
  };
};
