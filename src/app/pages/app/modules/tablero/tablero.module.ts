import {
    ArcElement,
    CategoryScale,
    Chart,
    DoughnutController,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';

import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { TableroEntrarComponent } from './components/tablero-entrar/tablero-entrar.component';
import { TableroRoutingModule } from './tablero-routing.module';

Chart.register(
    DoughnutController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

@NgModule({
    declarations: [TableroEntrarComponent],
    imports: [
        CommonModule,
        MatIconModule,
        ChartjsModule,
        MatButtonModule,
        MatTooltipModule,
        TableroRoutingModule,
        MatProgressBarModule,
    ],
})
export class TableroModule {}
