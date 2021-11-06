import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProjectDataStorageService } from './project-data-storage.service';
import { ProjectService } from './project.service';
import { Project } from '../../model/project.model';

@Injectable()
export class ProjectResolverService implements Resolve<Project[]> {
	constructor(private projectDataStorageService: ProjectDataStorageService, private projectService: ProjectService) {}
	resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
		const projects = this.projectDataStorageService.getProjects();

		if (projects.length === 0) {
			return this.projectService.fetchProjects();
		}

		return projects;
	}
}
