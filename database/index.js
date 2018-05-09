'use strict';

const r = require('rethinkdb');

module.exports = {
    getOneWhere: async function(table, key, value, pluck) {
        let conn = await r.connect({host: '127.0.0.1', port: 28015});
        let cursor = await r.db('twainbb').table(table).filter(r.row(key).eq(value)).pluck(pluck).run(conn);

        try {
            let arr = await cursor.toArray();
            return arr;
        } catch(e) {
            throw e;
        }
    },

    getWhereAnd: async function(table, key, value, tKey, tValue, pluck) {
        let conn = await r.connect({host: '127.0.0.1', port: 28015});
        let cursor = await r.db('twainbb').table(table).filter(r.row(key).eq(value).and(r.row(tKey).eq(tValue))).pluck([pluck]).run(conn);

        try {
            let arr = await cursor.toArray();
            return arr;
        } catch(e) {
            throw e;
        }
    },

    insert: async function(table, obj) {
        let conn = await r.connect({host: '127.0.0.1', port: 28015});
        let cursor = await r.db('twainbb').table(table).insert([obj]).run(conn);

        try {
            let arr = await cursor;
            return arr;
        } catch(e) {
            throw e;
        }
    }
};
