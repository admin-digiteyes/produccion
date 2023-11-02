import { Pipe, PipeTransform } from '@angular/core';

import { ITemplateFormsControl } from '../modules/templates/interfaces/i-template-forms-control';

@Pipe({
    name: 'sortFormControls',
})
export class SortFormControlsPipe implements PipeTransform {
    transform(formControls: ITemplateFormsControl[]): ITemplateFormsControl[] {
        return formControls.sort((a, b) => a.position_key - b.position_key);
    }
}
