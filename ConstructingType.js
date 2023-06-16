const express = require('express');
const { buildSchema, graphql } = require('graphql');
const graphqlHttp = require('express-graphql').graphqlHTTP;
// 定义schema，查询和类型
// const schema = buildSchema(`
//     type Account {
//         name: String
//         age: Int
//         sex: String
//         department: String
//         salary(city: String):Int
//     }
//     type Query{
//         getClassMates(classNo: Int!): [String]
//         account(username: String): Account
//     }
// `);
// // 定义查询对应的处理器
// const root = {
//     // getClassMates(arg.classNo){}
//     getClassMates({ classNo }) {
//         const obj = {
//             31: ['Amy', 'Bob', 'Cindy'],
//             61: ['David', 'Emma', 'Felix']
//         }
//         return obj[classNo];
//     },
//     account({ username }) {
//         const name = username;
//         const sex = 'male';
//         const age = 18;
//         const department = 'development dept.'
//         const salary = ({ city }) => {
//             if (city === 'Zurich' || city === 'Geneva' || city === 'Zug') {
//                 return 10000;
//             } else {
//                 return 3000;
//             }
//         }
//         return {
//             name,
//             sex,
//             age,
//             department,
//             salary,
//         }
//     }
// }

var AccountType = new graphql.GraphQLObjectType({
    name: 'Account',
    fields: {
        name: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
        sex: { type: graphql.GraphQLString },
        department: {
            type: graphql.GraphQLString
        }
    }
})

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        account: {
            type: AccountType,
            args: {
                username: { type: graphql.GraphQLString }
            },
            resolve: function (_, { username }) {
                const name = username;
                const sex = 'man';
                const age = 18;
                const department = '开发部';
                return {
                    name,
                    sex,
                    age,
                    department
                }
            }
        }
    }
});

var schema = new graphql.GraphQLSchema({ query: queryType })

const app = express();

app.use('/graphql', graphqlHttp({
    schema: schema,
    rootValue: root,
    // 开发者模式
    graphiql: true,
}))

// 公开文件夹，供用户访问静态资源
app.use(express.static('public'))

app.listen(3000);