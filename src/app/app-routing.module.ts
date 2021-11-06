import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error/error.component';

const routes: Routes = [
	{ path: '', redirectTo: '/projects', pathMatch: 'full' },
	{
		path: 'projects',
		loadChildren: () => import('./Project/project.module').then((m) => m.ProjectModule)
	},
	{ path: 'not-found', component: ErrorComponent, data: { message: 'Page not found!' } },
	{ path: '**', redirectTo: '/not-found' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
