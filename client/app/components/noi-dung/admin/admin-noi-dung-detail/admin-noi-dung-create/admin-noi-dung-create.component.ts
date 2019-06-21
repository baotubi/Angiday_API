import { Component } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { NoiDungService } from '../../../shared/noidung.service';

export class ModalContext extends BSModalContext {
    public id: number;
}

@Component({
    moduleId: module.id,
    selector: 'admin-noi-dung-create',
    templateUrl: './admin-noi-dung-create.component.html',
    styleUrls: ['./admin-noi-dung-create.component.css']
})
export class AdminNoiDungCreateComponent implements CloseGuard, ModalComponent<ModalContext> {

    constructor(private noiDungService: NoiDungService,
        public dialog: DialogRef<ModalContext>) {
    }

    private onEmitValue(value) {
        this.noiDungService.createNoiDung(value)
            .then(result => console.log(`success ${result}`))
            .catch(error => console.error('Error Khi Create Noi Dung', error))
            .then(() => this.onClose(false));
    }

    private onClose(isExit: boolean) {
        this.dialog.close({ exit: isExit });
    }
}