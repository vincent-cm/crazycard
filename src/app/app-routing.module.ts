import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadAllModules,
  RouterPreloader,
  NoPreloading
} from '@angular/router';

const routes: Routes = [
  {
    runGuardsAndResolvers: 'always',
    path: '',
    loadChildren: './card/card.module#CardModule'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
