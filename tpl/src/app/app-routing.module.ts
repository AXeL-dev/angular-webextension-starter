import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { PopupComponent } from './components/popup/popup.component';
import { Guard } from './services/guard.service';


const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: '**', component: PopupComponent, canActivate: [Guard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
