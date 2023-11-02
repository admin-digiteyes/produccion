import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { SettingsMiEquipoComponent } from './components/settings-mi-equipo/settings-mi-equipo.component';
import { SettingsPerfilComponent } from './components/settings-perfil/settings-perfil.component';

const routes: Routes = [
    {
        path: 'profile',
        component: SettingsPerfilComponent,
    },
    {
        path: 'mi-equipo',
        component: SettingsMiEquipoComponent,
    },
    {
        path: '**',
        redirectTo: 'profile',
        pathMatch: 'full',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
