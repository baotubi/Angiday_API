import express = require("express");

import { TinTucController } from '../../controllers';
import { TinTucValidator } from '../../middleware';

let router = express.Router();
export default class TinTucRouter {
    private _tintucCtr: TinTucController;

    constructor() {
        this._tintucCtr = new TinTucController();
    }

    get routes() {
        router.use(new TinTucValidator().validate);
        router.get("/getone", this._tintucCtr.getOne); //get du lieu , truyen vao 1 id
        router.get("/gettop", this._tintucCtr.getTop); // get top những dữ liệu đầu tiên
        router.post("/search", this._tintucCtr.search); // Tìm kiếm dữ liệu
        router.post("/delete", this._tintucCtr.delete); //xoa du lieu, truyen id vao ( truyen 1 hay theo nhieu id)
        // router.post("/save", this._tintucCtr.insert); //ko co thi tao du lieu, co roi thi luu lai du lieu moi
        router.post("/update", this._tintucCtr.update); //ko co thi tao du lieu, co roi thi luu lai du lieu moi
        router.get('/seek', this._tintucCtr.seek); // phân trang theo kiểu seek method
      
        return router;
    }
}

Object.seal(TinTucRouter);