import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./landingpage/landingpage.module').then(m => m.LandingpageModule)
    },
    {
        path: 'register',
        loadChildren: () => import('./register-form/register-form.module').then(m => m.RegisterFormModule)
    },
    {
        path: 'manageSight',
        loadChildren: () => import('./manage-sight-dialog/manage-sight-dialog.module').then(m => m.ManageSightDialogModule)
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
