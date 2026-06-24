import request from "supertest";
import app from "../app.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest, describe, test, expect, beforeAll, beforeEach, afterEach } from "@jest/globals";

// Set environment variables for testing
process.env.JWT_SECRET_KEY = "test-secret-key-for-jest";

describe("Auth Controller & Routes", () => {
    let hashedPassword;
    let getUserByEmailSpy;
    let createUserSpy;
    let getAllUsersSpy;

    beforeAll(async () => {
        // Create a real hash for the test password
        hashedPassword = await bcrypt.hash("password123", 10);
    });

    beforeEach(() => {
        // Spy on static methods to mock database operations dynamically in ES Modules
        getUserByEmailSpy = jest.spyOn(UserModel, "getUserByEmail");
        createUserSpy = jest.spyOn(UserModel, "createUser");
        getAllUsersSpy = jest.spyOn(UserModel, "getAllUsers");
    });

    afterEach(() => {
        // Restore original methods after each test to prevent test cross-contamination
        jest.restoreAllMocks();
    });

    describe("POST /api/auth/login", () => {
        test("1. Should login successfully with correct credentials", async () => {
            const mockUser = {
                id: "USR-1000",
                name: "Dr. Perera",
                role: "admin",
                designation: "Consultant",
                email: "dr.perera@forensic.gov",
                password_hash: hashedPassword,
                profile_picture_url: null
            };

            getUserByEmailSpy.mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "dr.perera@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body.user).toEqual({
                id: "USR-1000",
                name: "Dr. Perera",
                role: "admin",
                designation: "Consultant",
                email: "dr.perera@forensic.gov",
                profilePictureUrl: null
            });
            expect(getUserByEmailSpy).toHaveBeenCalledWith("dr.perera@forensic.gov");
        });

        test("2. Should fail to login with incorrect password", async () => {
            const mockUser = {
                id: "USR-1000",
                email: "dr.perera@forensic.gov",
                password_hash: hashedPassword
            };

            getUserByEmailSpy.mockResolvedValue(mockUser);

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "dr.perera@forensic.gov",
                    password: "wrongpassword"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid email or password");
        });
    });

    describe("POST /api/auth/register", () => {
        test("3. Should reject registration request without authentication", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    id: "USR-1001",
                    email: "new.user@forensic.gov",
                    password: "password123"
                });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Access denied. No token provided.");
        });
    });

    describe("GET /api/auth/users", () => {
        test("4. Should reject fetching users without token", async () => {
            const response = await request(app)
                .get("/api/auth/users");

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Access denied. No token provided.");
        });

        test("5. Should return all users when authenticated as admin", async () => {
            const mockUsers = [
                { id: "USR-1000", name: "Dr. Perera", role: "admin", email: "dr.perera@forensic.gov", password_hash: "secret" },
                { id: "USR-1002", name: "Dr. Hansara", role: "doctor", email: "dr.hansara@forensic.gov", password_hash: "secret" }
            ];

            getAllUsersSpy.mockResolvedValue(mockUsers);

            // Generate a valid admin token
            const adminToken = jwt.sign(
                { id: "USR-1000", role: "admin", name: "Dr. Perera" },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            );

            const response = await request(app)
                .get("/api/auth/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            // Verify password hashes are stripped out
            expect(response.body[0]).not.toHaveProperty("password_hash");
            expect(response.body[0].email).toBe("dr.perera@forensic.gov");
        });
    });
});
