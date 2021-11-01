import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Group } from './group.model';

@Injectable()
export class GroupService {
	groups: Group[] = [];
	groupsChange = new Subject<Group[]>();

	constructor(private http: HttpClient) {}

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
					this.groups = groups;
					this.groupsChange.next(this.groups.slice());
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
