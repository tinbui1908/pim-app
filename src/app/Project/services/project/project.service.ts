import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Project } from '../../models/project.model';
import { environment } from '../../../../environments/environment';
import { ProjectDataStorageService } from './project-data-storage.service';

@Injectable()
export class ProjectService {
	constructor(
		private http: HttpClient,
		private projectDataStorageService: ProjectDataStorageService,
		private router: Router
	) {}

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
				}),
				catchError((errorRes) => {
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);

					return throwError(errorRes);
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
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);

					return throwError(errorRes);
				})
			);
	}

	fetchProjectById(id: number) {
		return this.http
			.get<Project>(environment.apiUrl + '/project/' + id, {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					return responseData;
				}),
				tap((project: Project) => {
					this.projectDataStorageService.setProject(project);
				}),
				catchError((errorRes) => {
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);
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
				}),
				catchError((errorRes) => {
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);

					return throwError(errorRes);
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
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);

					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
