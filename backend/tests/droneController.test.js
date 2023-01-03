const request = require("supertest");
const app = require("../app");

describe("Test drone controller", () => {

    test("/api/drones has correct properties and has status of 200", done => {

        request(app)
            .get("/api/drones")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty("count");
                expect(response.body).toHaveProperty("list");
                expect(response.body).toHaveProperty("notInNDZ");
                done();
            });
    });

    test("/api/drones has data and and that they are correct types", done => {

        request(app)
            .get("/api/drones")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(typeof response.body.count).toBe("number");
                expect(response.body.list).toBeInstanceOf(Array);
                expect(response.body.notInNDZ).toBeInstanceOf(Array);
                done();
            });
    });

    test("/api/drones has drone data for drones that are not in the NDZ", done => {

        request(app)
            .get("/api/drones")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.notInNDZ).not.toHaveLength(0);
                done();
            });
    });

    test("/api/drones has drone data for drones that are not in the NDZ and there are correct properties", done => {

        request(app)
            .get("/api/drones")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.notInNDZ[0]).toHaveProperty("lastSeen");
                expect(response.body.notInNDZ[0]).toHaveProperty("sn");
                expect(response.body.notInNDZ[0]).toHaveProperty("closestDistanceToNest");
                expect(response.body.notInNDZ[0]).toHaveProperty("x");
                expect(response.body.notInNDZ[0]).toHaveProperty("y");
                done();
            });
    });

});
