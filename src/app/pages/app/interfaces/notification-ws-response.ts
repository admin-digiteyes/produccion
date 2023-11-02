import { TypeNotificationWsEnum } from "../enums/type-notification-ws.enum";

export interface INotificationWsResponse {
    type: TypeNotificationWsEnum;
    message: string;
}
