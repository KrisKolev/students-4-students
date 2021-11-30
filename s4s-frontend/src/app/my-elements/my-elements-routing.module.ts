/**
 * Component written by Michael Fahrafellner
 * creation date: 30.11.2021
 * last change done by: Michael Fahrafellner
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MyElementsComponent} from "./my-elements.component";

const routes: Routes = [
    {
        path: '',
        component: MyElementsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyElementsRoutingModule {
}
