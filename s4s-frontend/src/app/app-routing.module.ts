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
        path: 'sight/:sightId',
        loadChildren: () => import('./detail-page/detail-page.module').then(m => m.DetailPageModule)
    },
    {
        path: 'contact',
        loadChildren: () => import('./contactus-page/contactus-page.module').then(m => m.ContactusPageMmodule)
    },
    {
        path: 'profile',
        loadChildren: () => import('./profilepage/profilepage.module').then(m => m.ProfilepageModule)
    },
    {
        path: 'faq',
        loadChildren: () => import('./faq-page/faq-page.module').then(m => m.FaqPageModule)
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
