import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'arrayIncludes',
})
export class ArrayIncludesPipe implements PipeTransform {
    transform(array: any[], dataInclude: any): boolean {
        return array.includes(dataInclude);
    }
}
