import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'settings-ask-delete-user-team',
    templateUrl: './settings-ask-delete-user-team.component.html',
    styleUrls: ['./settings-ask-delete-user-team.component.css'],
})
export class SettingsAskDeleteUserTeamComponent implements OnInit {
    constructor(private _dialogRef: MatDialogRef<any>) {}

    ngOnInit(): void {}

    deleteUserTeam(status: boolean): void {
        this._dialogRef.close(status);
    }
}
