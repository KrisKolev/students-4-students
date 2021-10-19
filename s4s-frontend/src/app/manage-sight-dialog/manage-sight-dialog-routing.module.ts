/**
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ManageSightDialogComponent} from './manage-sight-dialog.component';

const routes: Routes = [
    {
        path: '',
        component: ManageSightDialogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageSightDialogRoutingModule {
}
