import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Project } from '../project.model';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	listProjects: Project[] = [];
	listProjectsChange = new Subject<Project[]>();

	constructor(private http: HttpClient) {}

	createNewProject(project: Project) {
		return this.http.post<Project>(environment.apiUrl + '/project', project, {
			observe: 'response',
			responseType: 'json'
		});
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
					this.listProjects = projects;
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			);
	}
}
