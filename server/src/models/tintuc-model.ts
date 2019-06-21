import { ModelBase } from './base-model';
export class TinTuc extends ModelBase {
    tin_tuc_id: number
    tieu_de: string;
    noi_dung: string;
}


export class TinTucCurrentStatusEnum {
    static readonly ACTIVE = 'active';
    static readonly DELETE = 'delete';
    static readonly PENDING = 'pending';
    static get values() {
        return [this.ACTIVE, this.DELETE, this.PENDING];
    }
}