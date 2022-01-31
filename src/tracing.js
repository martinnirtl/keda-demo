const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { Resource } = require('@opentelemetry/resources');

const tracerProvider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'greeting-service',
  }),
});

if (!process.env.OTEL_ENDPOINT_URL) {
  throw new Error('otel endpoint not defined');
}

const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_ENDPOINT_URL,
});
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(exporter));

tracerProvider.register();

registerInstrumentations({
  tracerProvider,
  instrumentations: [
    new PinoInstrumentation({
      // optional hook to insert additional context to log object. trace_id and span_id will be added automatically
      logHook: (_span, record) => {
        record[SemanticResourceAttributes.SERVICE_NAME] =
          tracerProvider.resource.attributes[SemanticResourceAttributes.SERVICE_NAME];
      },
    }),
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});
