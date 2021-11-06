import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from '../../models/group.model';
import { Employee } from '../../models/employee.model';
import { GroupDataStorageService } from '../../services/group/group-data-storage.service';
import { EmployeeDataStorageService } from '../../services/employee/employee-data-storage.service';
import { formatDate } from '@angular/common';
import { Project } from '../../models/project.model';
import { ProjectService } from '../../services/project/project.service';
import { ProjectDataStorageService } from '../../services/project/project-data-storage.service';

@Component({
	selector: 'app-new-project',
	templateUrl: './form-project.component.html',
	styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit, OnDestroy {
	projectForm: FormGroup;
	editMode = false;
	projectNumber!: number;
	project!: Project;
	errorDate: any = { isError: false, errorMessage: '' };

	groups: Group[];
	employees: Employee[];
	memberIDs: number[] = [];
	notExistMembers: string = '';

	groupsSubscription!: Subscription;
	employeesSubscription!: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private groupDataStorageService: GroupDataStorageService,
		private employeeDataStorageService: EmployeeDataStorageService,
		private projectService: ProjectService,
		private projectDataStorageService: ProjectDataStorageService
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params: Params) => {
			this.projectNumber = +params['projectNumber'];

			this.groups = this.groupDataStorageService.getGroups();
			this.groupsSubscription = this.groupDataStorageService.groupsChanged.subscribe((groups: Group[]) => {
				this.groups = groups;
			});

			this.employees = this.employeeDataStorageService.getEmployees();
			this.employeesSubscription = this.employeeDataStorageService.employeesChange.subscribe(
				(employees: Employee[]) => {
					this.employees = employees;
				}
			);

			if (this.projectNumber) {
				this.project = this.projectDataStorageService.getProject(this.projectNumber);
				this.editMode = true;
			}
		});
		this.initForm();
	}

	onSubmit() {
		this.compareTwoDates();
		if (!this.errorDate.isError) {
			this.projectForm.get('members').setValue(this.memberIDs);
			this.projectForm.get('groupId').setValue(+this.projectForm.value.groupId);
			if (this.editMode === true) {
				const projectNumber = this.projectForm.get('projectNumber').value;
				const id = this.projectDataStorageService
					.getProjects()
					.find((project) => project.ProjectNumber == projectNumber).ID;
				const updateProject = this.projectForm.value;
				updateProject.ID = id;
				this.projectService.updateProject(updateProject);
			} else {
				this.projectService.createNewProject(this.projectForm.value);
			}
			this.projectForm.reset();
			this.onCancel();
		}
	}
	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	existNumber(control: FormControl): { [s: string]: boolean } {
		if (this.editMode === true) {
			return null;
		}
		if (this.projectDataStorageService.getProjects().find((project) => project.ProjectNumber === control.value)) {
			return { existNumber: true };
		}
		return null;
	}

	checkMembers(visaList: string[]): number[] {
		const memberIDs: number[] = [];
		const employees = this.employees;

		for (let member of visaList) {
			const existEmployee = employees.find((employee) => employee.Visa === member);

			if (existEmployee) {
				memberIDs.push(existEmployee.ID);
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
				const visaList = control.value?.split(', ');

				if (visaList) {
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
				} else {
					resolve(null);
				}
			}, 1500);
		});
		return promise;
	}

	getVisas(employeeIds: number[]) {
		let visaList = '';
		let emp: Employee;
		for (let member of employeeIds) {
			emp = this.employeeDataStorageService.getEmployee(member);
			visaList = visaList + emp.Visa + ', ';
		}
		return visaList.slice(0, visaList.length - 2);
	}

	compareTwoDates() {
		const endDate: Date = this.projectForm.controls['endDate'].value;
		const startDate: Date = this.projectForm.controls['startDate'].value;
		if (endDate < startDate) {
			this.errorDate = {
				isError: true,
				errorMessage: 'End date can not before start date, please edit end date or start date!'
			};
		} else {
			this.errorDate = { isError: false, errorMessage: '' };
		}
	}

	private initForm() {
		let projectNumber = null;
		let name = '';
		let customer = '';
		let groupId = 1;
		let members = '';
		let status = 'new';
		let startDate = new Date();

		let endDate = null;

		if (this.editMode) {
			projectNumber = this.project.ProjectNumber;
			name = this.project.Name;
			customer = this.project.Customer;
			groupId = this.project.GroupId;
			members = this.getVisas(this.project.Members);
			status = this.project.Status;
			startDate = this.project.StartDate;
			endDate = this.project.EndDate;
		}

		this.projectForm = new FormGroup({
			projectNumber: new FormControl(projectNumber, [
				Validators.required,
				Validators.pattern(/^[1-9]+[0-0]*$/),
				this.existNumber.bind(this)
			]),
			name: new FormControl(name, Validators.required),
			customer: new FormControl(customer, Validators.required),
			groupId: new FormControl(groupId, Validators.required),
			members: new FormControl(members, [], this.notExistVisa.bind(this)),
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
