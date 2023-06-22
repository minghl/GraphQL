const express = require('express');
const { buildSchema } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const mysql = require('mysql');


var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'test',
    database: 'test'
});

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
        deleteAccount(id: ID!): Boolean
        updateAccount(id: ID!, input: AccountInput): Account
    }
    type Query {
        accounts: [Account]
    }
`);

// 定义查询对应的处理器
const root = {
    // 查询
    accounts() {
        return new Promise((resolve, reject) => {
            connection.query("select name, age, sex, department from account", (err, results) => {
                if (err) {
                    console.log('error');
                    return;
                }
                const arr = [];
                for (let i = 0; i < results.length; i++) {
                    arr.push({
                        name: results[i].name,
                        sex: results[i].sex,
                        age: results[i].age,
                        department: results[i].department,
                    })
                }
                resolve(results);
            })
        })
    },
    // 实际上是一个function
    // 增加
    createAccount({ input }) {
        const data = {
            name: input.name,
            sex: input.sex,
            age: input.age,
            department: input.department
        }
        return new Promise((resolve, reject) => {
            connection.query('insert into account set ?', data, (err) => {
                if (err) {
                    console.log('error');
                    return;
                }
                // 返回保存结果
                resolve(data);
            })
        })

        // query异步操作 return undefined

    },

    // 修改
    updateAccount({ id, input }) {
        const data = input;
        return new Promise((resolve, reject) => {
            connection.query('update account set ? where name = ?', [data, id], (err) => {
                if (err) {
                    console.log('error' + err.message);
                    return;
                }
                // 返回保存结果
                resolve(data);
            })
        })
    },

    // 删除
    deleteAccount({ id }) {
        return new Promise((resolve, reject) => {
            connection.query('delete from account where name = ?', [id], (err) => {
                if (err) {
                    console.log('error' + err.message);
                    reject(false);
                    return;
                }
                resolve(true);
            })
        });
    },
}

const app = express();

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: root,
    // 开发者模式
    graphiql: true,
}))


app.listen(3000);