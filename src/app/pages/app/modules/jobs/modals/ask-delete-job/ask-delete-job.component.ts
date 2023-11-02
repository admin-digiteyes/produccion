import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

import { IDeleteJobsRequest } from '../../interfaces/delete-jobs-request';
import { IJobResponse } from '../../interfaces/i-job-response';
import { JobsService } from '../../services/jobs.service';

@Component({
    selector: 'app-ask-delete-job',
    templateUrl: './ask-delete-job.component.html',
    styleUrls: ['./ask-delete-job.component.css'],
})
export class AskDeleteJobComponent implements OnInit {
    constructor(
        private _jobsService: JobsService,
        @Inject(MAT_DIALOG_DATA) public data: { job: IJobResponse },
        private _dialogRef: MatDialogRef<any>,
        private _authService: AuthService
    ) {
        this.isDeleting = false;
    }

    ngOnInit(): void {}

    isDeleting: boolean;

    async deleteJob(): Promise<void> {
        if (this.isDeleting) {
            return;
        }

        this.isDeleting = true;

        const token = await this._authService.getToken();

        const request: IDeleteJobsRequest = {
            jobId: this.data.job.id,
            token,
        };

        this._jobsService.deleteJob(request).subscribe({
            next: (response) => {
                this.isDeleting = false;
                this._dialogRef.close(true);
            },
            error: (error) => {
                this.isDeleting = false;
                this._dialogRef.close(false);
            },
        });
    }
}
