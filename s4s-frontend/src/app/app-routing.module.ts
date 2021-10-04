import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginDialogComponent} from "./login-dialog/login-dialog.component";

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./landingpage/landingpage.module').then(m => m.LandingpageModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./register-form/register-form.module').then(m => m.RegisterFormModule)
    },
    {
        path: '**',
        loadChildren: () => import('./error/error.module').then(m => m.ErrorModule)
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
