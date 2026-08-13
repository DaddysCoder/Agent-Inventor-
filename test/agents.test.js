import test from "node:test";
import assert from "node:assert/strict";
import { chooseSpecialists } from "../src/agents.js";

test("Inventor can think independently", () => assert.deepEqual(chooseSpecialists("Help me frame this ordinary question"), []));
test("solve mode calls science", () => assert.deepEqual(chooseSpecialists("anything", "solve"), ["scientific"]));
test("invent mode calls creativity", () => assert.deepEqual(chooseSpecialists("anything", "invent"), ["creative"]));
test("explore mode calls both discovery minds", () => assert.deepEqual(chooseSpecialists("anything", "explore"), ["creative", "scientific"]));
test("path mode calls Pathfinder", () => assert.deepEqual(chooseSpecialists("anything", "path"), ["pathfinder"]));
test("automatic routing can combine specialists", () => assert.deepEqual(chooseSpecialists("Invent a novel evidence model for an NDIS funding rule"), ["scientific", "creative", "pathfinder"]));
