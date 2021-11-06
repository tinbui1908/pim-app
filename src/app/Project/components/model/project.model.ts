import { Employee } from './employee.model';

export interface Project {
	ID: number;
	ProjectNumber: number;
	Name: string;
	Customer: string;
	Status: string;
	StartDate: Date;
	EndDate: Date;
	GroupId: number;
	Members: number[];
}
