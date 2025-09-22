import { describe, expect, it, vi } from 'vitest';

import { createLogger, LogEntry } from '../src/logger';

describe('createLogger', () => {
  it('writes to sinks above threshold', () => {
    const sink = vi.fn();
    const logger = createLogger({ level: 'info', sinks: [sink], includeTimestamp: false });

    logger.debug('should not log');
    logger.info('hello', { foo: 'bar' });

    expect(sink).toHaveBeenCalledTimes(1);
    const entry = sink.mock.calls[0][0] as LogEntry;
    expect(entry.level).toBe('info');
    expect(entry.metadata).toEqual({ foo: 'bar' });
  });

  it('honors child context and namespace', () => {
    const sink = vi.fn();
    const logger = createLogger({ name: 'core', sinks: [sink], includeTimestamp: false });
    const child = logger.child({ requestId: '123' }, 'api');

    child.warn('issue detected');

    const entry = sink.mock.calls[0][0] as LogEntry;
    expect(entry.namespace).toBe('core:api');
    expect(entry.context).toMatchObject({ requestId: '123' });
  });

  it('invokes file sink when provided', () => {
    const sink = vi.fn();
    const fileSink = vi.fn();
    const logger = createLogger({
      sinks: [sink],
      fileSink,
      includeTimestamp: false,
      level: 'debug',
    });

    logger.error('boom');

    expect(fileSink).toHaveBeenCalledTimes(1);
    expect(sink).toHaveBeenCalledTimes(1);
  });
});
