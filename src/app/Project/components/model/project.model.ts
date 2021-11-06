import { Employee } from './employee.model';

export interface Project {
	id: number;
	projectNumber: number;
	name: string;
	customer: string;
	status: string;
	startDate: Date;
	endDate: Date;
	groupId: number;
	members: number[];
}