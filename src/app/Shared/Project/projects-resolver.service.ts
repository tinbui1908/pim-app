import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProjectService } from '../../Project/services/project.service';
import { ProjectDataStorageService } from './project-data-storage.service';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ProjectResolverService implements Resolve<Project[]> {
	constructor(private projectDataStorageService: ProjectDataStorageService, private projectService: ProjectService) {}
	resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
		const projects = this.projectService.getProjects();

		if (projects.length === 0) {
			return this.projectDataStorageService.fetchProjects();
		}

		return projects;
	}
}
