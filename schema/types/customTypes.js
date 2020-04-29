const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList
} = require('graphql');

const AccountTypeEnum = require('./accountTypeEnum');
const mssql_owner = require('../../database/mssql/owner');
const mssql_account = require('../../database/mssql/account');

const ownerType = new GraphQLObjectType({
    name: 'OwnerType',
    fields: () => ({
        Id: { type: GraphQLID, name: "Id"},
        Name: {type: GraphQLString, Name: "Name"},
        Address: {type: GraphQLString},
        OwnedAccounts: {
            type: new GraphQLList(accountType),
            name: "OwnedAccounts",
            resolve(obj, args, { mssqlConfig }){
                return mssql_account(mssqlConfig).getByOwnerId(obj.Id);
            }
        },
        FirstAccount: {
            type: accountType,
            name: "FirstAccount",
            resolve(obj, args, {mssqlConfig}){
                 return mssql_account(mssqlConfig).getFirstByOwnerId(obj.Id);
            }
        }
    })
}); 

const accountType = new GraphQLObjectType({
    name: 'AccountType',
    fields: () => ({
        Id: { type: GraphQLID, name: "Id" },
        Description: { type: GraphQLString, name: "Description" },
        OwnerId: { type: GraphQLID, name: "OwnerId" },
        Type: { type: AccountTypeEnum, name: "Type" },
        AccountOwnerFoo: {
               name: "Wombat",
               type: ownerType,
               resolve(parent, args, {mssqlConfig}){
                    return mssql_owner(mssqlConfig).get(parent.OwnerId);
               }
        }
    })
});

module.exports = {
    ownerType,
    accountType
}