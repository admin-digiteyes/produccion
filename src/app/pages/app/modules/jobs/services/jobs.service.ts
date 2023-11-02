import { HttpClient } from '@angular/common/http';
import { ICreateJobsRequest } from '../interfaces/create-jobs-request';
import { IDeleteJobsRequest } from '../interfaces/delete-jobs-request';
import { IDeleteJobsResponse } from '../interfaces/delete-jobs-response';
import { IJobResponse } from '../interfaces/i-job-response';
import { IJobsRequest } from '../interfaces/jobs-request';
import { IJobsResponse } from '../interfaces/jobs-response';
import { IUpdateJobsRequest } from '../interfaces/update-jobs-request';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class JobsService {
    constructor(private _http: HttpClient) {}

    private readonly base_url: string = environment.url_gateway;
    private readonly base_url_textract: string = environment.url_textract_back;

    createJobs(data: ICreateJobsRequest): Observable<any> {
        const formData = new FormData();

        data.file.forEach((file) => formData.append('file', file, file.name));

        return this._http.post<any>(
            `${this.base_url_textract}/api/v1/textract/export/${data.templateId}/${data.userId}`,
            formData,
            {
                reportProgress: true,
                observe: 'events',
            }
        );
    }

    getJobs(data: IJobsRequest): Observable<IJobsResponse> {
        return this._http.post<IJobsResponse>(
            `${this.base_url}/jobs/paginate`,
            data
        );
    }

    updateJob(job: IUpdateJobsRequest): Observable<any> {
        return this._http.put<any>(
            `${this.base_url}/jobs`,
            job
        );
    }

    deleteJob(data: IDeleteJobsRequest): Observable<IDeleteJobsResponse> {
        return this._http.delete<IDeleteJobsResponse>(`${this.base_url}/jobs`, {
            body: data,
        });
    }
}
