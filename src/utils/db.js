const sqlite3 = require("sqlite3");
const fs = require('fs');

const db_dir_path = "./save"
const file_name = "data.db"
const file_path = `${db_dir_path}/${file_name}`

/**
 * データベースを初期化します。
 */
const init = ()=>{
    return new Promise(resolve => {
        if(fs.existsSync(file_path)){
            return;
        }
        if (!fs.existsSync(db_dir_path)) {
            fs.mkdirSync(db_dir_path, { recursive: true });
        }

        const db = new sqlite3.Database(file_path);

        db.serialize(()=>{
            db.run('CREATE TABLE IF NOT EXISTS setting_values (key TEXT PRIMARY KEY, value TEXT)');
            db.run('CREATE TABLE IF NOT EXISTS permissions (id INTEGER PRIMARY KEY AUTOINCREMENT, "group" TEXT, target_id TEXT, permission TEXT, action TEXT, type INTEGER)',()=>resolve());
            db.run('CREATE TABLE IF NOT EXISTS groups (sign TEXT PRIMARY KEY, name TEXT UNIQUE)');
            db.run('CREATE TABLE IF NOT EXISTS channels (id INTEGER PRIMARY KEY AUTOINCREMENT, "channel_id" TEXT, state TEXT)');
        })

        db.close()
    });
}

/**
 * SQL文を実行し、結果を返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
const query = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.all(statement, placeholder, (err, rows)=>{
            resolve(rows)
        })
        db.close();
    })
}

/**
 * SQL文を実行します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 */
const execute = (statement, placeholder)=>{
    const db = new sqlite3.Database(file_path);
    db.run(statement, placeholder);
    db.close();
}

/**
 * SQL文を実行し、該当する結果を配列ですべて返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<[unknown]>}
 */
const get_all = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.all(statement, placeholder, (err, rows)=>{
            resolve(rows?.length ? rows: [])
        })
        db.close();
    })
}

/**
 * SQL文を実行し、該当する結果のうち、1番最初のデータを返します。
 * @param {string}statement SQL文
 * @param {[]}[placeholder] プレースホルダー
 * @return {Promise<unknown>}
 */
const get_first = (statement, placeholder)=>{
    return new Promise((resolve) => {
        const db = new sqlite3.Database(file_path);
        db.get(statement, placeholder, (err, row)=>{
            resolve(row)
        })
        db.close();
    })
}

exports.init = init;
exports.query = query;
exports.execute = execute;
exports.get_all = get_all;
exports.get_first = get_first;
