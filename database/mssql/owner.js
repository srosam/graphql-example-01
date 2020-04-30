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
        });
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
        });
}


function insert(config, sql){
    return mssql.connect(config['connectionString'])
        .then(pool => {
            return pool.request().query(sql);
        }).then(result => {
            return true;
        }).catch(err => {
            console.log(err);
        });
}

module.exports = config => {
    
    function foo(id){
        return getFirstRecord(config, `SELECT TOP 1 * FROM OWNERS WHERE Id='${id}'`)
        .then((x)=>{
                console.log("foo done");
                return x;
        });

    }
    
    return {
        getAll() {
            return getAllRecords(config, "SELECT * FROM OWNERS");
        },
        get(id) {
            return foo(id);
        },
        add(id, name, address){
            return insert(config, `INSERT INTO OWNERS (id, name, address) VALUES ('${id}', '${name}', '${address}')`)
            .then((res)=>{
                return foo(id);
            });
        }
    }
}