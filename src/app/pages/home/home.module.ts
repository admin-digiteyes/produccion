import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { MainComponent } from './components/main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [MainComponent],
    imports: [CommonModule, HomeRoutingModule, RouterModule],
})
export class HomeModule {}
