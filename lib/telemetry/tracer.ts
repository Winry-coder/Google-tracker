/**
 * OpenTelemetry Tracer Configuration
 * Provides distributed tracing for observability
 */

/* TODO: Junior Developer — Configure OpenTelemetry
 * 1. Sign up for an observability provider (Honeycomb, Grafana, etc.)
 * 2. Set OTEL_EXPORTER_OTLP_ENDPOINT in .env
 * 3. Set OTEL_EXPORTER_OTLP_HEADERS with your API key
 * 4. Set OTEL_SERVICE_NAME (e.g., "drive-sync-app")
 */

interface TracerConfig {
  serviceName: string;
  endpoint?: string;
  headers?: string;
}

export function initTracer(config?: TracerConfig): void {
  const serviceName = config?.serviceName || process.env.OTEL_SERVICE_NAME;

  if (!serviceName) {
    console.warn('OpenTelemetry not configured - tracing disabled');
    return;
  }

  // Tracer initialization would happen here
  // This is a placeholder for the actual implementation
  console.log(`Tracer initialized for service: ${serviceName}`);
}

export function getTracer(name: string): {
  startSpan: (spanName: string) => SpanMock;
} {
  return {
    startSpan: (spanName: string) => new SpanMock(spanName),
  };
}

class SpanMock {
  constructor(private name: string) {}

  addEvent(_event: string, _attributes?: Record<string, unknown>): void {
    // Mock implementation
  }

  recordException(_error: Error): void {
    // Mock implementation
  }

  end(): void {
    // Mock implementation
  }
}
