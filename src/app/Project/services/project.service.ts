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

	getProject(projectNumber: number) {
		return this.projects.find((project) => project.projectNumber === projectNumber);
	}

	setProjects(projects: Project[]) {
		this.projects = projects;
		this.projectsChanged.next(this.projects.slice());
	}

	addProject(project: Project) {
		this.projects.push(project);
		this.projectsChanged.next(this.projects.slice());
	}

	updateProject(index: number, newProject: Project) {
		this.projects[index] = newProject;
		this.projectsChanged.next(this.projects.slice());
	}

	deleteProjects(selectedIDs: number[]) {
		for (let id of selectedIDs) {
			this.projects = this.projects.filter((project) => project.id !== id);
		}
		this.projectsChanged.next(this.projects.slice());
	}
}
