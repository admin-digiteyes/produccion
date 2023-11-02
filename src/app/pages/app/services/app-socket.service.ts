import { Observable, Subject } from 'rxjs';

import { IAuthenticationWsRequest } from '../interfaces/authentication-ws-request';
import { IAuthenticationWsResponse } from '../interfaces/authentication-ws-response';
import { INotificationWsResponse } from '../interfaces/notification-ws-response';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class AppSocketService {
    constructor(private socket: Socket) {
        this.dispatchAuthenticationWs =
            new Subject<IAuthenticationWsResponse>();
        this.dispatchNotificationWs = new Subject<INotificationWsResponse>();
        this.dispatchConnectWs = new Subject();

        this.listenAuthenticationWs =
            this.dispatchAuthenticationWs.asObservable();
        this.listenNotificationWs = this.dispatchNotificationWs.asObservable();
        this.listenConnectionWs = this.dispatchConnectWs.asObservable();

        this.socket.fromEvent('connect').subscribe(() => {
            // console.log('Disconnected WS');
            this.dispatchConnectWs.next();
        });

        this.socket.fromEvent('authentication').subscribe((response) => {
            // console.log('Authentication WS', response);

            this.dispatchAuthenticationWs.next(
                response as IAuthenticationWsResponse
            );
        });

        this.socket.fromEvent('notification').subscribe((response) => {
            // console.log('Notification WS', response);

            this.dispatchNotificationWs.next(
                response as INotificationWsResponse
            );
        });
    }

    private dispatchNotificationWs: Subject<INotificationWsResponse>;
    private dispatchAuthenticationWs: Subject<IAuthenticationWsResponse>;
    private dispatchConnectWs: Subject<void>;

    listenAuthenticationWs: Observable<IAuthenticationWsResponse>;
    listenNotificationWs: Observable<INotificationWsResponse>;
    listenConnectionWs: Observable<void>;

    connect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.socket.ioSocket.connected) {
                reject('Socket is already connected');
                return;
            }

            const timeout = window.setTimeout(() => {
                connect$.unsubscribe();
                reject('Timeout for connect socket');
            }, 5000);

            const connect$ = this.socket.fromEvent('connect').subscribe(() => {
                console.log('socket connected');

                connect$.unsubscribe();
                clearTimeout(timeout);

                resolve();
            });

            this.socket.connect();
        });
    }

    disconnect(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!this.socket.ioSocket.connected) {
                reject('Socket is not connected');
                return;
            }

            this.socket.disconnect(true);

            console.log('Disconnected success');
            resolve();
        });
    }

    authenticate(request: IAuthenticationWsRequest): void {
        this.socket.emit('authentication', request);
    }
}
