const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
// 定义schema，查询和类型
const schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Query {
        hello: String
        accounName: String
        age: Int
        account: Account
    }
`);
// 定义查询对应的处理器
const root = {
    hello: () => {
        return 'hello world';
    },
    accounName: () => {
        return 'john';
    },
    age: () => {
        return 18;
    },
    account: () => {
        return {
            name: 'Annie',
            age: 18,
            sex: 'Female',
            department: 'Science Academy',
        }
    }
}

const app = express();

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))

app.listen(3000);