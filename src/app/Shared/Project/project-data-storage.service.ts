import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Project } from '../../Shared/Project/project.model';
import { environment } from '../../../environments/environment';
import { ProjectService } from './../../Project/services/project.service';

@Injectable({ providedIn: 'root' })
export class ProjectDataStorageService {
	constructor(private http: HttpClient, private projectService: ProjectService) {}

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
					this.projectService.addProject(project);
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
					console.log(responseData);

					const projectsArray: Project[] = [];
					responseData.forEach((item) => {
						projectsArray.push(item);
					});
					return projectsArray;
				}),
				tap((projects: Project[]) => {
					this.projectService.setProjects(projects);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			);
	}

	deleteItems(selectedItemIDs: number[]) {
		console.log(selectedItemIDs);
		// return this.http
		// 	.post<Project>(environment.apiUrl + '/project/delete', selectedItemIDs, {
		// 		observe: 'response',
		// 		responseType: 'json'
		// 	})
		// 	.pipe(
		// 		map((response) => {
		// 			return response.body;
		// 		}),
		// 		tap((project) => {
		// 			this.projectService.deleteItems(selectedItemIDs);
		// 		})
		// 	)
		// 	.subscribe();
	}
}
