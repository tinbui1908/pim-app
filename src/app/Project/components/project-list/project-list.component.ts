import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Project } from '../model/project.model';
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
		this.projects = this.projectDataStorageService.getProjects();
		this.projectSubscription = this.projectDataStorageService.projectsChanged.subscribe((projects: Project[]) => {
			this.projects = projects;
			this.initProjectForm();
		});
		this.initProjectForm();
		this.initFeatureForm();
	}

	get controls() {
		// a getter!
		return (<FormArray>this.projectForm.get('selectedList')).controls;
	}

	get selectedNum() {
		return this.projectForm.value.selectedList.filter((checked) => checked === true).length;
	}

	initProjectForm() {
		let selectedList = new FormArray([]);
		this.projects.forEach(() => selectedList.push(new FormControl(false)));

		this.projectForm = new FormGroup({
			selectedList: selectedList
		});
	}

	initFeatureForm() {
		this.featureForm = new FormGroup({
			search: new FormControl(''),
			status: new FormControl('')
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
			.map((checked, i) => (checked ? this.projects[i].id : null))
			.filter((v) => v !== null);

		this.projectService.deleteItems(selectedItemIDs);
	}

	onSearch() {
		const status = this.featureForm.get('status').value;
		const search = this.featureForm.get('search').value;
		this.projectService.searchProjects(status, search);
	}

	onResetSearch() {
		this.featureForm.reset();
		window.location.reload();
	}

	ngOnDestroy() {
		this.projectSubscription.unsubscribe();
	}
}
