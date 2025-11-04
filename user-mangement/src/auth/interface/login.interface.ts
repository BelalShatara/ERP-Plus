export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}


export interface LoginRequest {
    username: string;
    password: string;
    grant_type: string;
    client_id: string;
    client_secret: string;
}