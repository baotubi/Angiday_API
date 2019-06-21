import { ModelBase } from './base-model';
export class MonAn extends ModelBase {
    mon_an_id: number;
    ten_mon_an: string;
    ten_mon_an_khong_dau: string;
    hinh_mon_an: string;
    nguyen_lieu: string;
    thuc_hien: string;
}
export class ThucPham extends ModelBase {
    thuc_pham_id: number;
    ten_thuc_pham: string;
    ten_thuc_pham_khong_dau: string;
    hinh_thuc_pham: string;
    level_thuc_pham: number;
    char: number;
}