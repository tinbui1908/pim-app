import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ProjectDataStorageService } from './project-data-storage.service';
import { ProjectService } from './project.service';
import { Project } from '../../models/project.model';

@Injectable()
export class ProjectByIdResolverService implements Resolve<Project> {
	constructor(
		private projectDataStorageService: ProjectDataStorageService,
		private projectService: ProjectService,
		private router: Router
	) {}
	resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
		const projectNumber = +route.params['projectNumber'];

		try {
			const id = this.projectDataStorageService.getProject(projectNumber).ID;
			const project = this.projectService.fetchProjectById(id);
			return project;
		} catch (error) {
			let route = this.router.config.find((r) => r.path === 'not-found');
			route.data = { message: 'Project ID is not exist!' };
			this.router.navigate(['/not-found']);
		}
	}
}
