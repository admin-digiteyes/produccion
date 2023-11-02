import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { IDeleteTemplateRequest } from '../../interfaces/delete-template-request';
import { ITemplateResponse } from '../../interfaces/i-template-response';
import { TemplatesService } from '../../services/templates.service';

@Component({
    selector: 'app-ask-delete-template',
    templateUrl: './ask-delete-template.component.html',
    styleUrls: ['./ask-delete-template.component.css'],
})
export class AskDeleteTemplateComponent implements OnInit {
    constructor(
        private _templatesService: TemplatesService,
        @Inject(MAT_DIALOG_DATA) public data: { template: ITemplateResponse },
        private _dialogRef: MatDialogRef<any>,
        private _authService: AuthService
    ) {
        this.isDeleting = false;
    }

    ngOnInit(): void {}

    isDeleting: boolean;

    async deleteTemplate(): Promise<void> {
        if (this.isDeleting) {
            return;
        }

        this.isDeleting = true;

        const token = await this._authService.getToken();

        const request: IDeleteTemplateRequest = {
            templateId: this.data.template.id,
            token,
        };

        this._templatesService.deleteTemplate(request).subscribe({
            next: () => {
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
