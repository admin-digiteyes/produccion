export interface PlanLoginResponse {
    plan: number;
    usedPages: number;
    usedStorage: number;
    users: number;
    admin?: number;
}
