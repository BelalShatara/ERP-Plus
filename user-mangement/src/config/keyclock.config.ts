// keycloak.config.ts
export const keycloakConfig = {
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8088/auth', // or your full Keycloak URL
    realm: process.env.KEYCLOAK_REALM || 'erp-plus ',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'user-management-api',
    secret: process.env.KEYCLOAK_SECRET || 'gfzW81yf9KyH36iIgnuukSp0O1x17dt0',   // from Keycloak client credentials
    tokenEndpoint: process.env.KEYCLOAK_TOKEN_ENDPOINT || 'http://127.0.0.1:8088/realms/erp-plus/protocol/openid-connect/token',
  };
  