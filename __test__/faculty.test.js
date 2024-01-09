const mongoose = require("mongoose");
const constant = require("../middleware/constants");
const { Faculty } = require("../models/faculty.model");
const { Direction } = require("../models/direction.model");
const fs = require("fs");

const {
  getFaculty,
  getDirectionAndGroup,
} = require("../controller/faculty.controller");

const facultyIdForTest = "65354f3c8302539a6d924f82";

// The JSON data is the default value for the database so it should be matched with the database
describe("(database) default user in faculty, direction, and group", () => {
  var jsonFileUnparsed, facultiesInJSON, directionsInJSON;

  beforeAll(async () => {
    try {
      await mongoose.connect(constant.dbConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: constant.dbName,
      });

      facultyJsonFileUnparsed = fs.readFileSync(
        __dirname + "/" + "assets" + "/" + "faculties.json",
        "utf-8"
      );

      directionJsonFileUnparsed = fs.readFileSync(
        __dirname + "/" + "assets" + "/" + "directions.json",
        "utf-8"
      );

      facultiesInJSON = JSON.parse(facultyJsonFileUnparsed);

      directionsInJSON = JSON.parse(directionJsonFileUnparsed).filter(
        (item) => item.facultyId === facultyIdForTest
      );
    } catch (err) {
      throw err;
    }
  });

  // Database directly
  test("test faculty response", async () => {
    const facultiesInDatabase = await Faculty.find();

    // Check if the length of the faculty in database is equal to or greater than in the JSON data
    expect(facultiesInDatabase.length).toBeGreaterThanOrEqual(
      facultiesInJSON.length
    );

    // Check if the faculty name are the same as the JSON data
    for (let i = 0; i < facultiesInJSON.length; i++) {
      expect(facultiesInDatabase[i].faculty).toEqual(
        facultiesInJSON[i].faculty
      );
    }
  });

  test("test direction and group response", async () => {
    const directionsInDatabase = await Direction.find({
      facultyId: new mongoose.Types.ObjectId(facultyIdForTest),
    });

    // Check if the length of direction in database is greater than or equal to the length of JSON data
    expect(directionsInDatabase.length).toBeGreaterThanOrEqual(
      directionsInJSON.length
    );

    // Check if the direction names are the same as in JSON data
    for (let i = 0; i < directionsInJSON.length; i++) {
      expect(directionsInDatabase[i].direction).toEqual(
        directionsInJSON[i].direction
      );
    }
  });

  // Database using controller function
  test("test faculty response using controller getFaculty", async () => {
    // Mock request and response objects
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function with the mock objects
    await getFaculty(mockReq, mockRes);

    const mockResJson = mockRes.json.mock.calls[0][0];

    // Check if status code is 200
    expect(mockRes.status).toHaveBeenCalledWith(200);

    // Check if the length of the faculty in database is equal to or greater than in the JSON data
    expect(mockResJson.length).toBeGreaterThanOrEqual(facultiesInJSON.length);

    // Check if the faculty name are the same as the JSON data
    for (let i = 0; i < facultiesInJSON.length; i++) {
      expect(mockResJson[i].faculty).toEqual(facultiesInJSON[i].faculty);
    }
  });

  test("test faculty response using controller getDirectionAndGroup", async () => {
    // Mock request and response objects
    const mockReq = {
      params: {
        id: facultyIdForTest,
      },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function with the mock objects
    await getDirectionAndGroup(mockReq, mockRes);

    const mockResJson = mockRes.json.mock.calls[0][0];

    // Check if status code is 200
    expect(mockRes.status).toHaveBeenCalledWith(200);

    // Check if the length of the direction in database is equal to or greater than in the JSON data
    expect(mockResJson.length).toBeGreaterThanOrEqual(directionsInJSON.length);

    // Check if the direction names are the same as the JSON data
    for (let i = 0; i < directionsInJSON.length; i++) {
      expect(mockResJson[i].direction).toEqual(directionsInJSON[i].direction);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

describe("(API) default user in faculty, direction, and group", () => {
  var facultyJsonFileUnparsed,
    directionJsonFileUnparsed,
    facultiesInJSON,
    directionsInJSON;

  beforeAll(async () => {
    try {
      facultyJsonFileUnparsed = fs.readFileSync(
        __dirname + "/" + "assets" + "/" + "faculties.json",
        "utf-8"
      );

      directionJsonFileUnparsed = fs.readFileSync(
        __dirname + "/" + "assets" + "/" + "directions.json",
        "utf-8"
      );

      facultiesInJSON = await JSON.parse(facultyJsonFileUnparsed);

      directionsInJSON = await JSON.parse(directionJsonFileUnparsed).filter(
        (item) => item.facultyId === facultyIdForTest
      );
    } catch (err) {
      throw err;
    }
  });

  test("test faculty response using API URL", async () => {
    try {
      const response = await fetch("https://mytsuclassroom.my.id/api/faculty");
      const facultiesInAPI = await response.json();

      // Check if the status code is 200
      expect(response.status).toBe(200);

      // Check if the length of the direction in database is equal to or greater than in the JSON data
      expect(facultiesInAPI.length).toBeGreaterThanOrEqual(
        facultiesInJSON.length
      );

      // Check if the faculty names are the same as the JSON data
      for (let i = 0; i < facultiesInJSON.length; i++) {
        expect(facultiesInAPI[i].faculty).toEqual(facultiesInJSON[i].faculty);
      }
    } catch (error) {
      throw error;
    }
  });

  test("test direction and group response using API URL", async () => {
    try {
      const response = await fetch(
        `https://mytsuclassroom.my.id/api/faculty/${facultyIdForTest}`
      );
      const directionsInAPI = await response.json();

      // Check if the status code is 200
      expect(response.status).toBe(200);

      // Check if the length of the direction in database is equal to or greater than in the JSON data
      expect(directionsInAPI.length).toBeGreaterThanOrEqual(
        directionsInJSON.length
      );

      // Check if the direction names are the same as the JSON data
      for (let i = 0; i < directionsInJSON.length; i++) {
        expect(directionsInAPI[i].direction).toEqual(
          directionsInJSON[i].direction
        );
      }
    } catch (error) {
      throw error;
    }
  });
});
