const {
    GraphQLEnumType
} = require ('graphql');

module.exports = new GraphQLEnumType({
    name: "AccountTypeEnum",
    values: {
        CASH: {value: 0},
        SAVINGS: {value: 1},
        EXPENSE: {value: 2},
        INCOME: {value: 3}
    }
});