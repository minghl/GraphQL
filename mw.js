const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
// 定义schema，查询和类型
const schema = buildSchema(`
    input AccountInput {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Account {
        name: String
        age: Int
        sex: String
        department: String
    }
    type Mutation {
        createAccount(input: AccountInput): Account
        updateAccount(id: ID!, input: AccountInput): Account
    }
    type Query {
        accounts: [Account]
    }
`);
const fakeDb = {};
// 定义查询对应的处理器
const root = {
    accounts() {
        var arr = [];
        for (const key in fakeDb) {
            arr.push(fakeDb[key]);
        }
        return arr;
    },
    // 实际上是一个function
    createAccount({ input }) {
        // 相当于数据库的保存
        fakeDb[input.name] = input;
        // 返回保存结果
        return fakeDb[input.name];
    },

    updateAccount({ id, input }) {
        // 相当于数据库的更新
        const updateAccount = Object.assign({}, fakeDb[id], input)
        fakeDb[id] = updateAccount;
        // 返回保存结果
        return updateAccount;
    },
}

const app = express();

const middleware = (req, res, next) => {
    if (!req.url.indexOf('/graphql') && !req.headers.cookie) {
        res.send(JSON.stringify({
            error: "not authorized"
        }));
        return;
    }
    next();
}

// 注册中间件
app.use(middleware);

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: root,
    // 开发者模式
    graphiql: true,
}))


app.listen(3000);