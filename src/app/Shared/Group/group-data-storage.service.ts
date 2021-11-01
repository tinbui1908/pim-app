import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Group } from './group.model';
import { GroupService } from '../../Project/services/group.service';

@Injectable({ providedIn: 'root' })
export class GroupDataStorageService {
	constructor(private http: HttpClient, private groupService: GroupService) {}

	fetchGroups() {
		return this.http
			.get<Group[]>(environment.apiUrl + '/group', {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					const groupsArray: Group[] = [];
					responseData.forEach((item) => {
						groupsArray.push(item);
					});
					return groupsArray;
				}),
				tap((groups: Group[]) => {
					this.groupService.setGroups(groups);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
