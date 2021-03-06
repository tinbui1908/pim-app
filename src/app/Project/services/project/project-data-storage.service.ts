import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Project } from '../../models/project.model';

@Injectable()
export class ProjectDataStorageService {
	private projects: Project[] = [];
	projectsChanged = new Subject<Project[]>();
	private projectById: Project;
	projectByIdChanged = new Subject<Project>();

	getProjects() {
		return this.projects.slice();
	}

	getProject(projectNumber: number) {
		return this.projects.find((project) => project.ProjectNumber === projectNumber);
	}

	getProjectById() {
		return this.projectById;
	}

	setProjects(projects: Project[]) {
		this.projects = projects;
		this.projectsChanged.next(this.projects.slice());
	}

	setProject(project: Project) {
		this.projectById = project;
		this.projectByIdChanged.next(this.projectById);
	}

	addProject(project: Project) {
		this.projects.push(project);
		this.projectsChanged.next(this.projects.slice());
	}

	updateProject(updateProject: Project) {
		for (let i = 0; i < this.projects.length; i++) {
			if (this.projects[i].ProjectNumber === updateProject.ProjectNumber) {
				this.projects[i] = updateProject;
			}
		}
		this.projectsChanged.next(this.projects.slice());
	}

	deleteProjects(selectedIDs: number[]) {
		for (let id of selectedIDs) {
			this.projects = this.projects.filter((project) => project.ID !== id);
		}
		this.projectsChanged.next(this.projects.slice());
	}

	deleteProject(id: number) {
		this.projects = this.projects.filter((project) => project.ID !== id);
		this.projectsChanged.next(this.projects.slice());
	}
}
