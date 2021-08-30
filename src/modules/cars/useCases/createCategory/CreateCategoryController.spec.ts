import { hash } from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import request from "supertest"
import { app } from "@shared/infra/http/app"
import createConnection from "@shared/infra/typeorm"
import { Connection } from "typeorm";

let connection: Connection

describe("Create Category Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash("admin", 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
                values('${id}','admin','admin@rentx.com.br','${password}',true,'now()','XXXXXXX')
            `
        );
    })
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    })
    let token: string;
    let refresh_token: string;
    it("Should be able to make login", async () => {
        const responseToken = await request(app)
            .post("/sessions")
            .send({
                email: "admin@rentx.com.br",
                password: "admin"
            })
            .expect(200)
        token = responseToken.body.token;
        refresh_token = responseToken.body.refresh_token;

    })
    it("should be able to create a new common user", async () => {
        const result = await request(app)
            .post("/users")
            .send({
                name: "new User",
                email: "email@jeff.com",
                password: "112358",
                driver_license: "11235813"
            })
            .set({
                Authorization: `Bearer ${token}`
            })

        expect(result.status).toBe(201);
    })
    it("should be able to create a new category", async () => {
        const result = await request(app)
            .post("/categories")
            .send({
                name: "Category supertest",
                description: "Category description supertest"
            })
            .set({
                Authorization: `Bearer ${refresh_token}`
            })

        expect(result.status).toBe(201);
    })
    it("should be able not to create a new category with name already exists", async () => {
        const result = await request(app)
            .post("/categories")
            .send({
                name: "Category supertest",
                description: "Category description supertest"
            })
            .set({
                Authorization: `Bearer ${refresh_token}`
            })

        expect(result.status).toBe(400);
    })

})