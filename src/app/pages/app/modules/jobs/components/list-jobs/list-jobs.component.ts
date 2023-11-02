import { Component, OnInit } from '@angular/core';

import { AppService } from 'src/app/pages/app/services/app.service';
import { AppSocketService } from 'src/app/pages/app/services/app-socket.service';
import { AskDeleteJobComponent } from '../../modals/ask-delete-job/ask-delete-job.component';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { IJobResponse } from '../../interfaces/i-job-response';
import { IJobsRequest } from '../../interfaces/jobs-request';
import { ISumaryJob } from '../../interfaces/sumary-job';
import { IUpdateJobsRequest } from '../../interfaces/update-jobs-request';
import { JobsService } from '../../services/jobs.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { TypeNotificationWsEnum } from 'src/app/pages/app/enums/type-notification-ws.enum';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-jobs',
    templateUrl: './list-jobs.component.html',
    styleUrls: ['./list-jobs.component.css'],
})
export class ListJobsComponent implements OnInit {
    constructor(
        private _jobsService: JobsService,
        private _authService: AuthService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _appSocketService: AppSocketService
    ) {
        this.jobs = [];
        this.isPaginating = true;

        this.jobsPaginator = new PageEvent();
        this.jobsPaginator.pageSize = 3;
        this.jobsPaginator.length = 0;

        this.sumaryJobs = {
            succeededs: 0,
            pending: 0,
            errored: 0,
        };

        this.base_url_textract_s3 = environment.api_url_textract_s3;
    }

    jobs: IJobResponse[];
    jobsPaginator: PageEvent;
    sumaryJobs: ISumaryJob;
    isPaginating: boolean;
    base_url_textract_s3: string;

    listenNotificationWs!: Subscription;

    async ngOnInit(): Promise<void> {
        const token: string = await this._authService.getToken();
        const pageIndex = this.jobsPaginator.pageIndex - 1;

        const request: IJobsRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
            },
            token,
        };

        this._jobsService.getJobs(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.jobs = response.jobs;
                this.jobsPaginator.length = response.paginator.length;

                this.sumaryJobs = { ...response.sumary };
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });

        this.listenNotificationWs =
            this._appSocketService.listenNotificationWs.subscribe(
                (response) => {
                    if (response.type == TypeNotificationWsEnum.STATE_JOB) {
                        this.paginate();
                    }
                }
            );
    }

    ngOnDestroy(): void {
        if (this.listenNotificationWs) {
            this.listenNotificationWs.unsubscribe();
        }
    }

    async paginate(event?: PageEvent): Promise<void> {
        if (this.isPaginating) {
            return;
        }

        this.isPaginating = true;

        const { pageIndex } = event || this.jobsPaginator;
        const token: string = await this._authService.getToken();
        const request: IJobsRequest = {
            paginator: {
                pageIndex: pageIndex | 0,
            },
            token,
        };

        this._jobsService.getJobs(request).subscribe({
            next: (response) => {
                this.isPaginating = false;
                this.jobs = response.jobs;
                this.jobsPaginator.length = response.paginator.length;
                this.sumaryJobs = { ...response.sumary };
            },
            error: (error) => {
                this.isPaginating = false;
                console.log(error);
            },
        });
    }

    deleteJob(job: IJobResponse): void {
        const dialog = this.dialog.open(AskDeleteJobComponent, {
            width: '400px',
            hasBackdrop: true,
            disableClose: true,
            data: { job },
        });

        dialog.afterClosed().subscribe((result) => {
            if (result) {
                this.paginate();
                this._snackBar.open(
                    'Análisis eliminado correctamente',
                    undefined,
                    {
                        horizontalPosition: 'end',
                        verticalPosition: 'top',
                        duration: 3000,
                        panelClass: ['snackbar'],
                    }
                );
            }
        });
    }

    downloadJob(job: IJobResponse): void {
        const file = document.createElement('a');
        file.hidden = true;
        file.download = job.filename_export;
        file.href = `${this.base_url_textract_s3}/${job.uuid}.xlsx`;
        file.click();
    }

    activeInputEdit(div: HTMLDivElement, input: HTMLInputElement): void {
        div.ariaLabel = '1';
        setTimeout(() => {
            input.focus();
        }, 100);
    }

    async updateJob(job: IJobResponse, inputE: HTMLInputElement): Promise<void> {
        const token: string = await this._authService.getToken();

        job.filename_export = inputE.value;

        const request: IUpdateJobsRequest = {
            token,
            job
        }

        this._jobsService.updateJob(request).subscribe((res) => {
            this._snackBar.open(
                'Análisis actualizado correctamente',
                undefined,
                {
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: ['snackbar'],
                }
            );

            this.paginate();
        });
    }
}
