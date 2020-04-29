const {
    nodeEnv
} = require('./util');
console.log(`Running in ${nodeEnv} mode...`);

const app = require('express')();

const mssqlConfig = require('../config/mssql')[nodeEnv];

const nSchema = require('../schema');
const graphQLHttp = require('express-graphql');

app.use('/graphql', graphQLHttp({
    schema: nSchema,
    graphiql: true,
    context: {
        mssqlConfig
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

