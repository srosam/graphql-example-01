const mssql = require('mssql');

mssql.on('error', error => {
    console.log(`Error in mssql ${error}`);
});

function getAllRecords(config, sql){
    return mssql.connect(config['connectionString'])
        .then(pool => {
            return pool.request()
                .query(sql);
        }).then(result => {
            return result["recordset"];
        }).catch(err => {
            console.log(err);
        }).then(res=>{ return res;});
}

function getFirstRecord(config, sql){
    return mssql.connect(config['connectionString'])
        .then(pool => {
            return pool.request()
                .query(sql);
        }).then(result => {
            return result["recordset"][0];
        }).catch(err => {
            console.log(err);
        }).then(res=>{ return res;});
}

module.exports = config => {
    return {
        getAll() {
            return getAllRecords(config, "SELECT * FROM ACCOUNTS");
        },
        get(id) {
            return getFirstRecord(config, `SELECT TOP 1 * FROM ACCOUNTS WHERE Id='${id}'`)
        },
        getByOwnerId(id) {
            return getAllRecords(config, `SELECT * FROM ACCOUNTS WHERE OwnerId='${id}'`)
        },
        getFirstByOwnerId(id) {
            return getFirstRecord(config, `SELECT TOP 1 * FROM ACCOUNTS WHERE OwnerId='${id}'`)
        }
    }
}