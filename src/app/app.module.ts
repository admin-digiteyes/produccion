import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {
    HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

const configSocketIt: SocketIoConfig = {
    url: environment.url_backend_socket,
    options: {
        autoConnect: false,
        path: '/socket.io',
    },
};

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SocketIoModule.forRoot(configSocketIt),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
