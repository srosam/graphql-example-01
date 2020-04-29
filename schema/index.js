const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull
} = require('graphql');

const mssql_owner = require('../database/mssql/owner');
const mssql_account = require('../database/mssql/account');

const OwnerType = require('./types/customTypes');

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        Owners: {
            type: GraphQLList(OwnerType.ownerType),
            description: "All account owners",
            resolve: (obj, args, { mssqlConfig }) => {
                return mssql_owner(mssqlConfig)
                    .getAll();
            }
        },
        Owner: {
            type: OwnerType.ownerType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            description: 'Account Owner',
            resolve: (obj, args, { mssqlConfig }) => {
                return mssql_owner(mssqlConfig).get(args.id);
            }
        },
        Accounts:{
            type: GraphQLList(OwnerType.accountType),
            description: "The Accounts",
            resolve: (obj, args, {mssqlConfig}) => {
                return mssql_account(mssqlConfig).getAll();
            }
        },
        Account: {
            type: OwnerType.accountType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            description: "The specified account",
            resolve: (obj, args, {mssqlConfig}) => {
                return mssql_account(mssqlConfig).get(args.id);
            }
        }
    }
});

const nSchema = new GraphQLSchema({
    query: RootQueryType,
    name: "RootQuery"
});

module.exports = nSchema;