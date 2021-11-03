import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Project } from '../../../Shared/Project/project.model';
import { ProjectService } from '../../services/project.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ProjectDataStorageService } from 'src/app/Shared/Project/project-data-storage.service';

@Component({
	selector: 'pim-project-list',
	styleUrls: ['./project-list.component.scss'],
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
	projects: Project[];
	projectSubscription!: Subscription;
	projectForm: FormGroup;
	closeResult = '';

	constructor(
		private modalService: NgbModal,
		private projectService: ProjectService,
		private projectDataStorageService: ProjectDataStorageService
	) {}

	ngOnInit() {
		this.projects = this.projectService.getProjects();
		this.projectSubscription = this.projectService.projectsChanged.subscribe((projects: Project[]) => {
			this.projects = projects;
			this.initForm();
		});
		this.initForm();
	}
	get controls() {
		// a getter!
		return (<FormArray>this.projectForm.get('selectedList')).controls;
	}

	get selectedNum() {
		return this.projectForm.value.selectedList.filter((checked) => checked === true).length;
	}

	initForm() {
		let selectedList = new FormArray([]);
		this.projects.forEach(() => selectedList.push(new FormControl(false)));

		this.projectForm = new FormGroup({
			selectedList: selectedList
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

		this.projectDataStorageService.deleteItems(selectedItemIDs);
	}

	ngOnDestroy() {
		this.projectSubscription.unsubscribe();
	}
}
