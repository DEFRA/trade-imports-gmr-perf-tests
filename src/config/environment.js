export const env = {
  // URL of Trade Imports GMR Finder service, default local
  tradeImportsGmrFinderUrl:
    !__ENV.ENVIRONMENT || __ENV.ENVIRONMENT === 'local'
      ? 'http://localhost:3000'
      : `https://trade-imports-gmr-finder.${__ENV.ENVIRONMENT}.cdp-int.defra.cloud`,
  // URL of Trade Imports GMR Processor service, default local
  tradeImportsGmrProcessorUrl:
    !__ENV.ENVIRONMENT || __ENV.ENVIRONMENT === 'local'
      ? 'http://localhost:3001'
      : `https://trade-imports-gmr-processor.${__ENV.ENVIRONMENT}.cdp-int.defra.cloud`,
};
