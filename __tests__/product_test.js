const request = require('supertest')
const app = require('../app')
const{ Product, Admin } = require('../models')
const {generateToken} = require('../helper/helper_token')
const {sequelize} = require('../models')
const { queryInterface } = sequelize

let access_token_admin = ''
let id = 14

let data = {
    name: 'clothes',
    image_url: 'clothes.jpg',
    stock: 10,
    price: 200.000
}
let data2 = {
    name: 'celana',
    image_url: 'abcd',
    stock: 111,
    price: 1234
}
let data_dummy

beforeAll (async (done) => {
    try {
        const admin = await Admin.findOne({
            where: {
                email: "admin1@gmail.com"
            }
        })
        access_token_admin = generateToken({id: admin.id, email: admin.email})
        done()
    } catch (error) {
        done(error)
    }
})

afterAll (async (done) => {
    queryInterface.bulkDelete("Products")
    .then(response => {
        done()
    })
    .catch(err => {
        done(err)
    })
})

describe('CRUD /product', ()=> {
    describe('Create product success POST /product', () => {
        test('response with object', (done) => {
            request(app)
            .post('/product')
            .send(data)
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err) 
                expect(status).toBe(201)
                expect(body).toHaveProperty("name", "clothes")
                expect(body).toHaveProperty("image_url", "clothes.jpg")
                expect(body).toHaveProperty("stock", 10)
                expect(body).toHaveProperty("price", 200.000)
                done()
            })
        })
    })
    describe('Create product error POST /product', () => {
        test.only('error post product', (done) => {
            request(app)
            .post('/product')
            .send(data_dummy)
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err) 
                expect(status).toBe(500)
                expect(body).toHaveProperty("message", "Internal server error")
                done()
            })
        })
    })
    describe('Read all product Success GET /product', () => {
        test('response with data', (done) => {
            request(app)
            .get('/product')
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                console.log(res.body);
                if(err) return done(err)
                expect(status).toBe(200)
                done()
            })
        })  
    })
    describe('Create product error GET /product', () => {
        test.only('error get product', (done) => {
            request(app)
            .get('/product')
            .send(data_dummy)
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err) 
                expect(status).toBe(500)
                expect(body).toHaveProperty("message", "Internal server error")
                done()
            })
        })
    })
    describe('Edit product Success Edit /product/:id', () => {
        test('response with data', (done) => {
            request(app)
            .put('/product/' + id)
            .set('access_token', access_token_admin)
            .send(data2)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err)
                expect(status).toBe(200)
                expect(body).toHaveProperty("name", "celana")
                expect(body).toHaveProperty("image_url", "abcd")
                expect(body).toHaveProperty("stock", 111)
                expect(body).toHaveProperty("price", 1234)
                done()
            })
        })  
    })
    describe('Edit product fail Edit /product/:id', () => {
        test('response with error', (done) => {
            request(app)
            .put('/product/' + id)
            .set('access_token', access_token_admin)
            .send(data2)
            .end((err, res) => {
    
                if(err) return done(err) 
                expect(status).toBe(500)
                expect(body).toHaveProperty("message", "Internal server error")
                done()
            })
        })  
    })
    describe('Delete product Success Delete /product/:id', () => {
        test('response with data', (done) => {
            request(app)
            .delete('/product/' + id)
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err)
                expect(status).toBe(200)
                done()
            })
        })  
    })
    describe('Delete product error Delete /product/:id', () => {
        test('response with error', (done) => {
            request(app)
            .delete('/product/' + id)
            .set('access_token', access_token_admin)
            .end((err, res) => {
                const {body, status} = res

                if(err) return done(err) 
                expect(status).toBe(500)
                expect(body).toHaveProperty("message", "Internal server error")
                done()
            })
        })  
    })
})
