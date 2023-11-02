import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'job-ask-delete-file',
    templateUrl: './job-ask-delete-file.component.html',
    styleUrls: ['./job-ask-delete-file.component.css'],
})
export class JobAskDeleteFileComponent implements OnInit {
    constructor(private _dialogRef: MatDialogRef<any>) {}

    ngOnInit(): void {}

    deleteFile(status: boolean): void {
        this._dialogRef.close(status);
    }
}
