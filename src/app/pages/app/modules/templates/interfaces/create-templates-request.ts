export interface ICreateTemplateRequest {
    name: string;
    type: 'FORMS' | 'TABLES';
    userId: number;
    file: File
}
