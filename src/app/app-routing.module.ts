import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: '/projects', pathMatch: 'full' },
	{ path: 'projects', loadChildren: () => import('./Project/project.module').then((m) => m.ProjectModule) }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
