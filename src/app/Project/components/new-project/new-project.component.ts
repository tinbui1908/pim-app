import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from '../../../Shared/Group/group.model';
import { Employee } from '../../../Shared/Employee/employee.model';
import { ProjectService } from '../../services/project.service';
import { GroupService } from '../../services/group.service';
import { EmployeeService } from '../../services/employee.service';
import { ProjectDataStorageService } from './../../../Shared/Project/project-data-storage.service';
import { Project } from 'src/app/Shared/Project/project.model';
import { formatDate } from '@angular/common';

@Component({
	selector: 'app-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {
	projectForm: FormGroup;
	editMode = false;
	projectNumber!: number;
	project!: Project;

	groups: Group[];
	employees: Employee[];
	memberIDs: number[] = [];
	notExistMembers: string = '';

	groupsSubscription!: Subscription;
	employeesSubscription!: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private groupService: GroupService,
		private employeeService: EmployeeService,
		private projectService: ProjectService,
		private projectDataStorageService: ProjectDataStorageService
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			this.projectNumber = +params['projectNumber'];
			if (this.projectNumber) {
				this.project = this.projectService.getProject(this.projectNumber);
				this.editMode = true;
			}
			this.initForm();
		});

		this.groups = this.groupService.getGroups();
		this.groupsSubscription = this.groupService.groupsChanged.subscribe((groups: Group[]) => {
			this.groups = groups;
		});

		this.employees = this.employeeService.getEmployees();
		this.employeesSubscription = this.employeeService.employeesChange.subscribe((employees: Employee[]) => {
			this.employees = employees;
		});
	}

	onSubmit() {
		try {
			this.projectForm.get('members').setValue(this.memberIDs);
			this.projectForm.get('groupId').setValue(+this.projectForm.value.groupId);
			if (this.editMode === true) {
				this.projectDataStorageService.createNewProject(this.projectForm.value);
				this.projectForm.reset();
				this.onCancel();
			}
		} catch (error) {
			console.log(error.message);
		}
	}
	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	existNumber(control: FormControl): { [s: string]: boolean } {
		if (this.editMode === true) {
			return null;
		}
		if (this.projectService.getProjects().find((project) => project.projectNumber === control.value)) {
			return { existNumber: true };
		}
		return null;
	}

	checkMembers(visaList: string[]): number[] {
		const memberIDs: number[] = [];
		const employees = this.employees;

		for (let member of visaList) {
			const existEmployee = employees.find((employee) => employee.visa === member);

			if (existEmployee) {
				memberIDs.push(existEmployee.id);
			} else {
				memberIDs.push(0);
			}
		}

		return memberIDs;
	}

	notExistVisa(control: FormControl): Promise<any> | Observable<any> {
		const promise = new Promise<any>((resolve, reject) => {
			setTimeout(() => {
				if (control.value === '') {
					resolve(null);
				}
				const visaList = control.value.split(', ');

				const memberIDs = this.checkMembers(visaList);
				this.notExistMembers = '';

				if (memberIDs.includes(0)) {
					for (let i = 0; i < memberIDs.length; i++) {
						if (memberIDs[i] === 0) {
							this.notExistMembers = this.notExistMembers + visaList[i] + ' ';
						}
					}

					resolve({ notExistVisa: true });
				} else {
					this.memberIDs = memberIDs.slice();
					resolve(null);
				}
			}, 1500);
		});
		return promise;
	}

	private initForm() {
		let projectNumber = null;
		let name = '';
		let customer = '';
		let groupId = 1;
		let status = 'new';
		let startDate = new Date();

		let endDate = null;

		if (this.editMode) {
			projectNumber = this.project.projectNumber;
			name = this.project.name;
			customer = this.project.customer;
			groupId = this.project.groupId;
			status = this.project.status;
			startDate = this.project.startDate;
			endDate = this.project.endDate;
		}

		this.projectForm = new FormGroup({
			projectNumber: new FormControl(projectNumber, [Validators.required, this.existNumber.bind(this)]),
			name: new FormControl(name, Validators.required),
			customer: new FormControl(customer, Validators.required),
			groupId: new FormControl(groupId, Validators.required),
			members: new FormControl('', [], this.notExistVisa.bind(this)),
			status: new FormControl(status, Validators.required),
			startDate: new FormControl(formatDate(startDate, 'yyyy-MM-dd', 'en'), Validators.required),
			endDate: new FormControl(endDate !== null ? formatDate(endDate, 'yyyy-MM-dd', 'en') : endDate)
		});
	}

	ngOnDestroy() {
		this.employeesSubscription.unsubscribe();
		this.groupsSubscription.unsubscribe();
	}
}
