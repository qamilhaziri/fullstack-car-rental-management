const getReachableHost = (container) => {
  const host = container.getHost();

  // Docker publishes ports on IPv4 on GitHub-hosted runners. Node may try the
  // IPv6 localhost address first, which can result in an unhelpful AggregateError.
  return host === "localhost" ? "127.0.0.1" : host;
};

export const configurePostgresEnvironment = (container) => {
  const host = getReachableHost(container);
  const connectionUrl = new URL(container.getConnectionUri());

  connectionUrl.hostname = host;
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = connectionUrl.toString();
};

export const getContainerHost = getReachableHost;

export const runIntegrationSetup = async (name, setup) => {
  try {
    await setup();
  } catch (error) {
    const causes = error instanceof AggregateError ? error.errors : [error];

    console.error(`${name} integration setup failed.`);
    causes.forEach((cause) => console.error(cause));
    throw error;
  }
};
