export interface IUpdateUserSecurityRequest {
    current_password: string;
    new_password: string;
    token: string;
}
