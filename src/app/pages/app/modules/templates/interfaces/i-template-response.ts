import { ITemplateFormsControl } from "./i-template-forms-control";

export interface ITemplateResponse {
    id: number;
    name: string;
    type: 'FORMS' | 'TABLES' | 'INVOICES';
    status: 'COMPLETED' | 'PENDING' | 'ERRORED';
    joined: string | null;
    forms_control: ITemplateFormsControl[];
}
