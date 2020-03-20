import * as path from "path";
import * as fs from 'fs';

import { Sequelize, Model, DataTypes, BuildOptions, Op } from "sequelize";

import { Config } from '../config';
import { log } from './log';

export interface IDb {
    SysInfo: ISysInfo,
    Entry: IEntry,
    seq: any,
    db: any,
    Op: any
}

let models = {};
let         modelArray = [], associations = [];

    let database = new Sequelize(Config.db.name, Config.db.user, Config.db.pass, {
    dialect: Config.db.dialect,
    logging: false
});

let modules = fs.readdirSync(path.join(__dirname, '/..', 'models'));
for(let k = -1; ++k < modules.length;){
    if (modules[k].indexOf('.ts') == -1 && modules[k].indexOf('.map') == -1) {
        let mod = require('./../models/' + modules[k]);
        modelArray = modelArray.concat(mod.models);

        if (mod.Associations)
            associations.push(mod.Associations);
    }
}

for(let m = -1; ++m < modelArray.length;){
    let model = database.import(modelArray[m].name, modelArray[m]);
    models[model.name] = model;
}

for(let m = -1; ++m < associations.length;){
    console.log(associations, m);
    associations[m](models);
}

let SysInfo: ISysInfo = models["SysInfo"];
let Entry: IEntry = models["Entry"];

let Data: IDb = {
    seq: Sequelize,
    Op: Op,
    db: database,
    SysInfo,
    Entry
};

export { Data }

interface ISysInfo extends Model {
    version: string;
    create: Function;
}

interface IEntry extends Model {
    create: Function,
    findOne: Function,
    uid: string
}
