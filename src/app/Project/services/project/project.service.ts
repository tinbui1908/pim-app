import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Project } from '../../models/project.model';
import { environment } from '../../../../environments/environment';
import { ProjectDataStorageService } from './project-data-storage.service';

@Injectable()
export class ProjectService {
	constructor(private http: HttpClient, private projectDataStorageService: ProjectDataStorageService) {}

	createNewProject(project: Project) {
		return this.http
			.post<Project>(environment.apiUrl + '/project', project, {
				observe: 'response',
				responseType: 'json'
			})
			.pipe(
				map((response) => {
					return response.body;
				}),
				tap((project) => {
					this.projectDataStorageService.addProject(project);
				})
			)
			.subscribe();
	}

	updateProject(updateProject: Project) {
		return this.http
			.put<Project>(environment.apiUrl + '/project', updateProject, {
				observe: 'response',
				responseType: 'json'
			})
			.pipe(
				map((response) => {
					return response.body;
				}),
				tap((project) => {
					this.projectDataStorageService.updateProject(project);
				})
			)
			.subscribe();
	}

	fetchProjects() {
		return this.http
			.get<Project[]>(environment.apiUrl + '/project', {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					const projectsArray: Project[] = [];
					responseData.forEach((item) => {
						projectsArray.push(item);
					});
					return projectsArray;
				}),
				tap((projects: Project[]) => {
					this.projectDataStorageService.setProjects(projects);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			);
	}

	deleteItems(selectedItemIDs: number[]) {
		return this.http
			.post<Project>(environment.apiUrl + '/project/delete', selectedItemIDs, {
				observe: 'response',
				responseType: 'json'
			})
			.pipe(
				map((response) => {
					return response.body;
				}),
				tap((project) => {
					this.projectDataStorageService.deleteProjects(selectedItemIDs);
				})
			)
			.subscribe();
	}

	searchProjects(status: string, search: string) {
		return this.http
			.get<Project[]>(environment.apiUrl + `/project?status=${status}&search=${search}`, {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					const projectsArray: Project[] = [];
					responseData.forEach((item) => {
						projectsArray.push(item);
					});
					return projectsArray;
				}),
				tap((projects: Project[]) => {
					this.projectDataStorageService.setProjects(projects);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
