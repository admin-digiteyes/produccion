import { Component, OnInit } from '@angular/core';

import { init } from 'aos';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        init();
    }
}
