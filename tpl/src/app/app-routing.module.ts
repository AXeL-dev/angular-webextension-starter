import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { MainComponent } from './components/main/main.component';
import { Guard } from './services/guard.service';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: MainComponent, canActivate: [Guard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
