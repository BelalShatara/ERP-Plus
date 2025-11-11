// keycloak.config.ts
export const keycloakConfig = {
    keycloakUrl: process.env.KEYCLOAK_URL || 'http://0.0.0.0:8088',
    authServerUrl: process.env.KEYCLOAK_URL + '/auth', // or your full Keycloak URL
    realm: process.env.KEYCLOAK_REALM || 'erp-plus ',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'user-management-api',
    secret: process.env.KEYCLOAK_SECRET || 'gfzW81yf9KyH36iIgnuukSp0O1x17dt0',   // from Keycloak client credentials
    tokenEndpoint: process.env.KEYCLOAK_URL + '/realms/erp-plus/protocol/openid-connect/token',
    userEndpoint: process.env.KEYCLOAK_URL + '/admin/realms/erp-plus/users',
  };
  