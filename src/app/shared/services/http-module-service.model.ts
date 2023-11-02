import { HttpBackend, HttpRequest } from '@angular/common/http';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpResponse,
} from '@angular/common/http';
import { InjectionToken, Injector } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export class HttpBackendClient implements HttpHandler {
    constructor(private backend: HttpBackend, private injector: Injector) {}

    handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        // Use the HttpBackend to make the request
        return this.backend.handle(request);
    }
}

export class FetchBackend implements HttpBackend {
    handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
        const headers = new Headers();

        for (const key of request.headers.keys()) {
            headers.append(key, request.headers.get(key)!);
        }

        const fetchReq = new Request(request.url, {
            method: request.method,
            headers: headers,
            body: JSON.stringify(request.body),
            mode: 'no-cors'
        });

        return from(fetch(fetchReq)).pipe(
            switchMap((response) =>
              from(response.text()).pipe(
                map((body) => new HttpResponse({ body, status: response.status, statusText: response.statusText }))
              )
            ),
            catchError((err) => throwError(new HttpErrorResponse({ error: err })))
          );
    }
}

// Define an InjectionToken for the HttpBackend provider
export const FETCH_BACKEND = new InjectionToken<HttpBackend>('FETCH_BACKEND');
