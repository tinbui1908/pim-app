import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Project } from '../../models/project.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ProjectService } from '../../services/project/project.service';
import { ProjectDataStorageService } from '../../services/project/project-data-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'pim-project-list',
	styleUrls: ['./project-list.component.scss'],
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
	projects: Project[];
	projectSubscription!: Subscription;
	routeSubscription: Subscription;
	projectForm: FormGroup;
	featureForm: FormGroup;
	closeResult = '';

	constructor(
		private modalService: NgbModal,
		private projectService: ProjectService,
		private projectDataStorageService: ProjectDataStorageService,
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		let status = '',
			search = '';
		this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
			status = params.get('status') || '';
			search = params.get('search') || '';
			this.initFeatureForm(status, search);
		});

		if (search != '' || status != '') {
			this.projectService.searchProjects(status, search);
		}

		this.projects = this.projectDataStorageService.getProjects();
		this.projectSubscription = this.projectDataStorageService.projectsChanged.subscribe((projects: Project[]) => {
			this.projects = projects;
			this.initProjectForm();
		});
		this.initProjectForm();
	}

	get controls() {
		return (<FormArray>this.projectForm.get('selectedList')).controls;
	}

	get selectedNum() {
		return this.projectForm.value.selectedList.filter((checked) => checked === true).length;
	}

	initProjectForm() {
		const selectedList = new FormArray([]);
		this.projects.forEach(() => selectedList.push(new FormControl(false)));

		this.projectForm = new FormGroup({
			selectedList: selectedList
		});
	}

	initFeatureForm(status: string, search: string) {
		this.featureForm = new FormGroup({
			status: new FormControl(status),
			search: new FormControl(search)
		});
	}

	open(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
				this.onDelete();
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				console.log(this.closeResult);
			}
		);
	}
	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	onDelete() {
		const selectedItemIDs = this.projectForm.value.selectedList
			.map((checked, i) => (checked ? this.projects[i].ID : null))
			.filter((v) => v !== null);

		this.projectService.deleteItems(selectedItemIDs);
	}

	onSearch() {
		const status = this.featureForm.get('status').value;
		const search = this.featureForm.get('search').value;
		if (search === '' && status !== '') {
			this.router.navigate(['../projects'], { queryParams: { status: status } });
		} else if (status === '' && search !== '') {
			this.router.navigate(['../projects'], { queryParams: { search: search } });
		} else if (status !== '' && search !== '') {
			this.router.navigate(['../projects'], { queryParams: { status: status, search: search } });
		}
		this.projectService.searchProjects(status, search);
	}

	onResetSearch() {
		this.router.navigate(['../projects'], { relativeTo: this.route });
	}

	ngOnDestroy() {
		this.projectSubscription.unsubscribe();
		this.routeSubscription.unsubscribe();
	}
}
