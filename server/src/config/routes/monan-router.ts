import express = require("express");
import { MonAnController } from '../../controllers';
import { TinTucValidator } from '../../middleware';

let router = express.Router();
export default class MonAnRouter {
    private _monanCtr: MonAnController;

    constructor() {
        this._monanCtr = new MonAnController();
    }

    get routes() {
        router.use(new TinTucValidator().validate);
        router.get("/getone", this._monanCtr.getOne); //done  truyền id thì lấy thực phẩm, không truyền thì lấy toàn bộ
        router.get("/getonemonan", this._monanCtr.getOneMonAn);  //done Lấy 1 món ăn theo id, không truyền thì lấy toàn bộ
        router.post("/delete", this._monanCtr.delete); //done        
        router.get("/gettop", this._monanCtr.getTop); // get top những dữ liệu đầu tiên
        router.post("/search", this._monanCtr.search); // Tìm kiếm thực phẩm
        router.post("/insert", this._monanCtr.insert); 
        router.post("/update", this._monanCtr.update); 
        router.get('/seek', this._monanCtr.seek); // phân trang theo kiểu seek method
        return router;
    }
}

Object.seal(MonAnRouter);