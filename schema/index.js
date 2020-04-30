const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = require('graphql');

const mssql_owner = require('../database/mssql/owner');
const mssql_account = require('../database/mssql/account');

const customTypes = require('./types/customTypes');

const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    description: 'Root for mutations',
    fields: () => ({
        addOwner: {
            type: customTypes.ownerType,
            description: 'Add an Owner',
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
                name: {type: GraphQLNonNull(GraphQLString)},
                address: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args, {mssqlConfig}) => {
                return mssql_owner(mssqlConfig)
                    .add(args.id, args.name, args.address)
                    .then((val) => {
                        return val;
                    });
            }
        },
        addAccount: {
            type: customTypes.accountType,
            description: 'Add an Account',
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
                description: {type: GraphQLString},
                type: {type:  GraphQLNonNull(GraphQLID)},
                ownerId: {type: GraphQLNonNull(GraphQLID)}
            },
            resolve: (parent, args, {mssqlConfig}) => {
                return mssql_account(mssqlConfig)
                            .add(args.id, args.description, args.type, args.ownerId)
                            .then((val) => {
                                return val;
                            });
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'Root for queries',
    fields: {
        Owners: {
            type: GraphQLList(customTypes.ownerType),
            description: "All account owners",
            resolve: (obj, args, { mssqlConfig }) => {
                return mssql_owner(mssqlConfig)
                    .getAll();
            }
        },
        Owner: {
            type: customTypes.ownerType,
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
            type: GraphQLList(customTypes.accountType),
            description: "The Accounts",
            resolve: (obj, args, {mssqlConfig}) => {
                return mssql_account(mssqlConfig).getAll();
            }
        },
        Account: {
            type: customTypes.accountType,
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
    mutation: RootMutation,
    name: "RootQuery"
});

module.exports = nSchema;