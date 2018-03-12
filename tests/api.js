/* global describe, it, __dirname */

/*
    https://mochajs.org/
*/ 

const DF = require('../lib/api')
const fs = require('fs')
const path = require('path')

describe('Dialogflow api module', () => {

    let devTokenPath = path.resolve(__dirname, './.access_tokens/dev.txt')
    let clientTokenPath = path.resolve(__dirname, './.access_tokens/client.txt')
    DF.setClientToken(fs.readFileSync(clientTokenPath))
    DF.setDevToken(fs.readFileSync(devTokenPath))

    describe('Dialogflow api module', () => {

        let runner = (type) => {
            describe(type, () => {

                it(`got results for all ${type}`, () => {
                    return DF.get(type)
                })

                it(`posted ${type}, then got it`, () => {
                    let payload = fs.readFileSync(path.resolve(__dirname, `./objects/test-${type}.json`), 'utf8')
                    payload = JSON.parse(payload)
                    payload.forEach(obj => obj.name = 'TEST_' + Math.round(Math.random() * 100000))
                    return DF.post(type, {payload}).then(res => {
                        return DF.get(type, {id: res.id})
                    })
                })

                it(`put ${type}`, () => {
                    return DF.get(type).then(arr => {
                        let objID = arr[0].id
                        // console.log(arr[0])
                        return DF.get(type, {id: objID})
                    }).then(obj => {
                        // console.log(obj)
                        let payload = [obj]
                        return DF.put(type, {payload, id: obj.id})
                    })
                })

                it(`delete ${type}`, () => {
                    let payload = fs.readFileSync(path.resolve(__dirname, `./objects/test-${type}.json`), 'utf8')
                    payload = JSON.parse(payload)
                    payload.forEach(obj => obj.name = 'TEST_' + Math.round(Math.random() * 100000))
                    return DF.post(type, {payload}).then(res => {
                        return DF.delete(type, {id: res.id})
                    })
                })
            })
        }

        runner('intents')
        runner('entities')

        // TODO: test /query
        // TODO: test /contexts
        // TODO: test /userEntities

        // TODO: CLI tests
    })
})
