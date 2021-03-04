import request from 'supertest';
import {app} from "../../app";

it('returns a 201 on successful signup', async ()=> {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 on invalid email signup', async ()=> {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 on invalid password signup', async ()=> {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'a'
        })
        .expect(400);
});

it('returns a 400 on missing email and password signup', async ()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'omas@om.com'
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'omas@om.com'
        })
        .expect(400);
});

it('disallows duplicate emails', async ()=> {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'omas@om.com',
            password: 'oomgomg'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'omas@om.com',
            password: 'oomgomg'
        })
        .expect(400);
});

it('sets a cookie after successful signup', async ()=>{
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'omas@om.com',
            password: 'oomgomg'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
})