import * as express from 'express';
import * as pg from 'pg';
import * as _ from 'lodash';

import { IBaseController } from "./base-controller";
import { TinTucRepository } from '../repositories';
import { VARIABLES, ControllerUtil, OperatorEnum } from '../util';
import { TinTuc } from '../models';


export default class TinTucController implements IBaseController {
    private _tintucRepo: TinTucRepository;
    constructor() {
        this._tintucRepo = new TinTucRepository();
    }


    /**
     * @author Nhật Anh 17/04/2017
     * 
     * api lấy 1 noi_dung
     * 
     * GET api/noi_dung/getone/?noi_dung_id
     */

    getOne = (req: express.Request, res: express.Response): void => {
        let id = req.query.tin_tuc_id;
        if (!id) {
            res.status(400).json({
                error: 'bị lỗi'
            });
            return;
        }

        // let promiseResult = this._tintucRepo.getOne(id)
        //     .then(result => {
        //         if (result.rowCount > 0) {
        //             let noidung = result.rows.map(r => this.rowMapper(r))[0];
        //             return { result: noidung };
        //         } else {
        //             return {
        //                 status: 400,
        //                 error: {
        //                     error_type: VARIABLES.ErrorMessage.NO_DATA,
        //                     message: VARIABLES.ErrorMessage.NO_DATA_WITH_ID(id)
        //                 }
        //             }
        //         }

        //     });

        // ControllerUtil.resovleResponse(res, promiseResult);
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * lấy 1 danh sách những phần tử dữ liệu đứng đầu
     * 
     * GET api/noi_dung/gettop/top?standard=col_name+0&?offset=0
     * api/tin_tuc/gettop?standard=tin_tuc_id%2b1&offset=0
     */

    getTop = (req: express.Request, res: express.Response): void => {
        let promiseResult = this._tintucRepo.getTop()
            .then(result => {
                let noidungs = result.rows.map(r => this.rowMapper(r));
                return { result: noidungs };
            });

        ControllerUtil.resovleResponse(res, promiseResult);
    }

    save = (req: express.Request, res: express.Response): void => {
        let promiseResult = this._tintucRepo.insert(req.body)
            .then(result => {
                return { status: 201, count: result.rowCount }
            });
        ControllerUtil.resovleResponse(res, promiseResult);
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * update dữ liệu dựa vào id
     * nhận vào 1 req.body có cấu trúc như entity
     * 
     * POST /api/noi_dung/update
     */
    update = (req: express.Request, res: express.Response): void => {
        if (!req.body.tin_tuc_id || !req.body.user_update) {
            res.status(400).json({
                error: {
                    error_type: VARIABLES.ErrorMessage.MISSING_PARAM,
                    message: VARIABLES.ErrorMessage.NEED_COLUMN_IN(['tin_tuc_id', 'noi_dung'], ['int', 'string'], 'body')
                }
            });
            return;
        }

        let promiseResult = this._tintucRepo.update(req.body)
            .then(result => {
                if (result.rowCount > 0) {
                    return { result: [], count: result.rowCount };
                } else {
                    return {
                        status: 400,
                        error: {
                            error_type: VARIABLES.ErrorMessage.NO_DATA,
                            message: `${VARIABLES.ErrorMessage.NO_DATA_WITH_ID(req.body.noi_dung_id)}, không có gì để update`
                        }
                    }
                }
            });

        ControllerUtil.resovleResponse(res, promiseResult);
    }

    /** 
     * @author Nhật Anh 17/04/2017
     * 
     * xóa dữ liệu dựa theo id 
     * truyền vào 1 hay nhiều id (number)
     * 
     * POST /api/noi_dung/delete
     */
    delete = (req: express.Request, res: express.Response): void => {
        if (!req.body.tin_tuc_id) {
            res.status(400).json({
                error: {
                    error_type: VARIABLES.ErrorMessage.MISSING_PARAM,
                    message: VARIABLES.ErrorMessage.NEED_COLUMN_IN(['tin_tuc_id'], ['mảng int'], 'body')
                }
            });
            return;
        }

        let promiseResult = this._tintucRepo.delete(req.body.tin_tuc_id)
            .then(result => {
                if (result.rowCount > 0) {
                    return { result: [], count: result.rowCount };
                } else {
                    return {
                        status: 400,
                        error: {
                            error_type: VARIABLES.ErrorMessage.NO_DATA,
                            message: `${VARIABLES.ErrorMessage.NO_DATA_WITH_ID(req.body.tin_tuc_id)}, không có gì để delete`
                        }
                    };
                }
            })

        ControllerUtil.resovleResponse(res, promiseResult);
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     *  api noi_dung/search
     * đưa vào page, per_page, và các cột zới giá trị cần tìm
     * nếu chỉ có page và per_page thì sẽ trả zề hết
     * 
     * 
     * POST /api/noi_dung/search
     */
    search = (req: express.Request, res: express.Response): void => {
        let obj = req.body;
        let limit = obj.per_page || 10;
        let page = obj.page;
        let order = obj.order || 'tin_tuc_id+0';
        let current_status = obj.current_status;
        let offset;
        if (!page || page === 1) {
            offset = 0;
        } else {
            offset = limit * (page - 1);
        }
        delete obj.page;
        delete obj.per_page;
        delete obj.order;
        if (_.isEmpty(current_status)) {
            delete obj.current_status;
        }

        // let promiseNumberOfRow = this._tintucRepo.count(obj);
        let promiseResult = this._tintucRepo.search(obj, order, limit, offset)
            .then(result => {
                let noidungs = result.rows.map(r => this.rowMapper(r));
                return noidungs;
            })
            // .then(noidungs => {
            //     return promiseNumberOfRow.then(numberOfRow => {
            //         return { result: noidungs, number_of_all_data: numberOfRow.rows[0] };
            //     })
            // });

        ControllerUtil.resovleResponse(res, promiseResult);
    }

    /**
     * /api/noi_dung/seek?id=2&per_page=10&time='2017-02-01'&upperBound=true
     */
    public seek = (req: express.Request, res: express.Response): void => {
        let id = req.query.id || null;
        let per_page = req.query.per_page;
        let operator;
        if (req.query.upper_bound && req.query.upper_bound === 'true') {
            operator = OperatorEnum.UPPERBOUND;
        } else {
            operator = OperatorEnum.LOWERBOUND;
        }


        let promiseResult = this._tintucRepo.seek(per_page, operator, id)
            .then(result => {
                let noidungs = result.rows.map(r => this.rowMapper(r));
                return { result: noidungs };
            });

        ControllerUtil.resovleResponse(res, promiseResult);
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * chuyển kết quả truy vấn thành Object
     * 
     * @private
     * @param {any} queryResult kết quả truy vấn
     * @returns {tintuc} 
     * 
     */
    private rowMapper(queryResult): TinTuc {
        let tintuc = new TinTuc();
        tintuc.tin_tuc_id = queryResult.tin_tuc_id;
        tintuc.noi_dung = queryResult.noi_dung;
        tintuc.tieu_de = queryResult.tieu_de;

        return tintuc;
    }
}