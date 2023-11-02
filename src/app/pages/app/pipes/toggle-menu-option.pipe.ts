import { Pipe, PipeTransform } from '@angular/core';

import { IDrawerOption } from 'src/app/shared/interfaces/drawer-menu';
import { UserRole } from 'src/app/shared/enums/user-role';

@Pipe({
    name: 'toggleMenuOption',
})
export class ToggleMenuOptionPipe implements PipeTransform {
    transform(
        option: IDrawerOption,
        userRole?: UserRole,
        planActivated?: boolean
    ): boolean {
        if(option.id == 7 && userRole == UserRole.User){
            return false;
        }

        if(option.id == 4 && !planActivated){
            return false;
        }

        return true;
    }
}
