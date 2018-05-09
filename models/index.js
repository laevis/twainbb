'use strict';
const r = require('rethinkdb');

module.exports = async function IndexModel() {
    let conn = await r.connect({host: '127.0.0.1', port: 28015});
    let cursor = await r.db('twainbb').table('topics').run(conn);

    try {
        let arr = await cursor.toArray();
        return {topics: arr};
    } catch(e) {
        throw e;
    }
}
