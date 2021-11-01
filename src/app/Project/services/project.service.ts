import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Project } from 'src/app/Shared/Project/project.model';
@Injectable()
export class ProjectService {
	private projects: Project[] = [];
	projectsChanged = new Subject<Project[]>();

	getProjects() {
		return this.projects.slice();
	}

	getProject(index: number) {
		return this.projects[index];
	}

	setProjects(projects: Project[]) {
		this.projects = projects;
		this.projectsChanged.next(this.projects.slice());
	}

	addProject(project: Project) {
		this.projects.push(project);
		this.projectsChanged.next(this.projects.slice());
	}

	updateRecipe(index: number, newProject: Project) {
		this.projects[index] = newProject;
		this.projectsChanged.next(this.projects.slice());
	}

	deleteRecipe(index: number) {
		this.projects.splice(index, 1);
		this.projectsChanged.next(this.projects.slice());
	}
}
