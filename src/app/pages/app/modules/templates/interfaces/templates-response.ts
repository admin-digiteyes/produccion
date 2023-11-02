import { ISumaryTemplate } from './sumary-template';
import { ITemplateResponse } from './i-template-response';

export interface ITemplatesResponse {
    templates: ITemplateResponse[];
    paginator: IPaginatorResponse;
    sumary: ISumaryTemplate;
}

interface IPaginatorResponse {
    /**
     * Totol number of items
     */
    length: number;

    pageIndex: 0;
}
