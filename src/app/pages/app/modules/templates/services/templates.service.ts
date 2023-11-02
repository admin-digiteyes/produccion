import {
    IVerifyTemplateRequest,
    IVerifyTemplateResponse,
} from '../interfaces/verify-template.model';

import { HttpClient } from '@angular/common/http';
import { ICreateTemplateRequest } from '../interfaces/create-templates-request';
import { IDeleteTemplateRequest } from '../interfaces/delete-template-request';
import { ITemplatesRequest } from '../interfaces/templates-request';
import { ITemplatesResponse } from '../interfaces/templates-response';
import { IUpdateTemplatesRequest } from '../interfaces/update-templates-request';
import { IUpdateTemplatesResponse } from '../interfaces/update-templates-response';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class TemplatesService {
    constructor(private _http: HttpClient) {}

    private readonly base_url: string = environment.url_gateway;
    private readonly base_url_textract: string = environment.url_textract_back;

    createTemplate(data: ICreateTemplateRequest): Observable<any> {
        const formData = new FormData();
        formData.append('file', data.file, data.file.name);

        return this._http.post<any>(
            `${this.base_url_textract}/api/v1/textract/analyze/${data.type}/${data.name}/${data.userId}`,
            formData,
            {
                reportProgress: true,
                observe: 'events',
            }
        );
    }

    getTemplates(data: ITemplatesRequest): Observable<ITemplatesResponse> {
        return this._http.post<ITemplatesResponse>(
            `${this.base_url}/templates/paginate`,
            data
        );
    }

    updateTemplates(
        data: IUpdateTemplatesRequest
    ): Observable<IUpdateTemplatesResponse> {
        return this._http.put<IUpdateTemplatesResponse>(
            `${this.base_url}/templates`,
            data
        );
    }

    deleteTemplate(data: IDeleteTemplateRequest): Observable<string> {
        return this._http.delete<string>(`${this.base_url}/templates`, {
            body: data,
        });
    }

    verifyTemplate(
        data: IVerifyTemplateRequest
    ): Observable<IVerifyTemplateResponse> {
        return this._http.post<IVerifyTemplateResponse>(
            `${this.base_url}/templates/verify`,
            data
        );
    }
}
