import { ITemplateFormsControl } from './i-template-forms-control';

export interface IUpdateTemplatesRequest {
    id: number;
    name: string;
    forms_control: ITemplateFormsControl[];
    token: string;
}
