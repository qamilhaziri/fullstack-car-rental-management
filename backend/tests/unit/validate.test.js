import {expect,jest,test,describe,beforeEach} from "@jest/globals";
import { createRequest, createResponse } from "../helpers/http.js";

const schema = { safeParse : jest.fn()}

const { validate } = await import ("../../middleware/validate.js");


describe("validate middleware", () => {

    beforeEach(() => {jest.resetAllMocks()})

    test("Invalid data should return a bad request response.", () => {
        schema.safeParse.mockReturnValue({success : false, error: {
        issues: [
            {
                path: ["email"],
                message: "Invalid email",
            },
        ],
    },})

        const validateCall = validate(schema);

        const log = { warn: jest.fn() }; const req = createRequest({body : {},log}); const res = createResponse();
        const next = jest.fn();

        validateCall(req,res,next);

        expect(res.status).toHaveBeenCalledWith(400); expect(res.json).toHaveBeenCalledWith({
                message: "Please check the data."
            });
        expect(next).not.toHaveBeenCalled(); expect(schema.safeParse).toHaveBeenCalledWith(req.body);
    })



})