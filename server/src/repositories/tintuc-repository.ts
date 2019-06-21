
import * as validator from 'validator';
import * as pg from 'pg';
import * as express from 'express';

import { TinTuc, TinTucCurrentStatusEnum } from '../models';

import { RepoUtil } from './util';
import { pgConnect } from './base';
import * as _ from 'lodash';

interface QueryOption {
    tieu_de?: string;
    tin_tuc_id?: number;
    noi_dung?: string;
}

export class TinTucRepository {

    constructor() {
    }



    /**
     * @author Nhật Anh 17/04/2017
     * 
     * tìm kiếm noi_dung
     * @param {QueryOption} option chứa các cột cần tìm
     * @param {string} [orderBy] chuỗi để sắp xếp theo format ten_cot+0(hoặc 1)[,ten_cot+0(hoặc 1)...]
     * @param {number} [limit] lấy bao nhiệu
     * @param {number} [offset] lấy từ dòng thứ mấy
     * @returns {Promise<NoiDung[]>} danh sách noi_dung
     * 
     * @memberOf NoiDungRepository
     */
    public search(option: QueryOption, orderBy?: string, limit?: number, offset?: number): Promise<pg.QueryResult> {
        let queryText = " select tin_tuc_id,noi_dung,tieu_de from tin_tuc ";
        // let whereClause = RepoUtil.buildWhereQuery(option);
        // queryText += whereClause.query;
        // if (orderBy) {
        //     queryText += ' ' + RepoUtil.convertQueryForOrderBy(orderBy);
        // }
        // if (limit) {
        //     queryText += ` limit $${whereClause.params.length + 1}`;
        //     whereClause.params.push(limit);
        // }
        // if (offset) {
        //     queryText += ` offset $${whereClause.params.length + 1}`;
        //     whereClause.params.push(offset);
        // }

        return pgConnect.runAQuery(queryText)
            .catch(error => {
                error['queryText'] = queryText;
                return Promise.reject(error);
            });
    }

    public seek(per_page: number, operator: string, id: number = null): Promise<pg.QueryResult> {
        let param = [id, per_page];
        let whereAndOrderQuery = `where (tin_tuc_id) ${operator} ((select * from tin_tuc where tin_tuc_id = $1),$1) order by tin_tuc_id desc, tin_tuc_id desc limit $2`;
        if (!id) {
            whereAndOrderQuery = `order by tin_tuc_id desc limit $1`;
            param = [per_page];
        }
        let query = `select * from tin_tuc ${whereAndOrderQuery} `;

        return pgConnect.runAQuery(query, param)
            .catch(error => {
                error['value'] = param;
                return Promise.reject(error);
            });
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * lấy noi_dung đứng đầu
     * 
     * @param {string} standard chuỗi để sắp xếp theo format ten_cot+0(hoặc 1)[,ten_cot+0(hoặc 1)...]
     * @param {number} offset lấy từ dòng thứ mấy
     * @returns {Promise<NoiDung[]>} danh sách noi_dung
     * 
     * @memberOf NoiDungRepository
     */
     //api/tin_tuc/gettop?standard=tin_tuc_id%2b1&offset=0

    public getTop(): Promise<pg.QueryResult> {
    

        let queryText: string = `select * from tin_tuc`;

        return pgConnect.runAQuery(queryText)
            .catch(error => {
                error['queryText'] = queryText;
                return Promise.reject(error);
            });
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * lấy một noi_dung theo id
     * 
     * @param {number} id của noi_dung
     * @returns {Promise<TinTuc>} noi_dung
     * 
     * @memberOf NoiDungRepository
     */
    public getOne(id: number): Promise<pg.QueryResult> {
        let queryText = `select * from tin_tuc where tin_tuc_id = $1`;
        return pgConnect.runAQuery(queryText, [id])
            .catch(error => {
                error['queryText'] = queryText;
                return Promise.reject(error);
            });
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * dùng để xóa noi_dung theo id
     * 
     * @param {number[]} ids các id để xóa
     * @returns {Promise<number>} số dòng đã xóa
     * 
     * @memberOf NoiDungRepository
     */
    public delete(ids: number[]): Promise<pg.QueryResult> {
        let queryText;
        queryText = `DELETE FROM tin_tuc WHERE tin_tuc_id = ANY ($1::int[])`;

        return pgConnect.runAQuery(queryText, [ids])
            .catch(error => {
                error['queryText'] = queryText;
                //console.log(queryText)
                return Promise.reject(error);
            });
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * thêm 1 noi_dung
     * 
     * @param {NoiDung} noidung cần thêm
     * @returns {Promise<number>} số dòng đã thêm
     * 
     * @memberOf NoiDungRepository
     */
    public insert(tintuc: TinTuc): Promise<pg.QueryResult> {
        let queryText;
        queryText = `
            INSERT INTO public.tin_tuc(
                    tieu_de, 
                    noi_dung, 
                    tin_tuc_id )
             VALUES (
                    $1,
                    $2,
                    $3
                    );
                    `;
        return pgConnect.runAQuery(queryText,
            [
                tintuc.tieu_de,
                tintuc.noi_dung,
                tintuc.tin_tuc_id
            ])
            .catch(error => {
                 error['queryText'] = queryText;
                 error['value'] = tintuc;
                return Promise.reject(error);
            });
    }

    /**
     * @author Nhật Anh 17/04/2017
     * 
     * update noi_dung
     * 
     * @param {QueryOption} option các cột cần update
     * @returns {Promise<number>} số dòng đã update
     * 
     * @memberOf NoiDungRepository
     */
    public update(option: QueryOption): Promise<pg.QueryResult> {
        let setQuery = RepoUtil.buildSetQuery(option, ['tin_tuc_id', 'noi_dung']);
        setQuery.params.push(option.tin_tuc_id);
        setQuery.params.push(option.tin_tuc_id);

        let queryText = `UPDATE "tin_tuc"
            ${setQuery.query}, noi_dung = $${setQuery.params.length}
        	WHERE "tin_tuc_id" = $${setQuery.params.length - 1};`;

        return pgConnect.runAQuery(queryText, setQuery.params)
            .catch(error => {
                error['queryText'] = queryText;
                return Promise.reject(error);
            });
    }

    public count(object = {}): Promise<pg.QueryResult> {
        if (_.isEmpty(object)) {
            return pgConnect.runAQuery('select count(tin_tuc_id) from tin_tuc');
        }

        let query = 'select count(tin_tuc_id) from tin_tuc';
        let where = RepoUtil.buildWhereQuery(object);
        return pgConnect.runAQuery(query + ` ${where.query}`, where.params);
    }






}
