"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursePurchased = exports.createCourse = void 0;
const prismaClient_1 = require("./prismaClient");
const createCourse = (_a) => __awaiter(void 0, [_a], void 0, function* ({ courseId, name, courseCreator, educatorName }) {
    try {
        const result = yield prismaClient_1.prisma.courses.create({
            data: {
                courseId: Number(courseId),
                name: name,
                educatorId: courseCreator.toLowerCase(),
                educatorName: educatorName,
            }
        });
        console.log(result);
    }
    catch (e) {
        console.log(e);
    }
});
exports.createCourse = createCourse;
const CoursePurchased = (_a) => __awaiter(void 0, [_a], void 0, function* ({ purchaser, courseId, amount, courseCreator }) {
    try {
        const result = yield prismaClient_1.prisma.$transaction([
            prismaClient_1.prisma.purchases.create({ data: { userId: purchaser.toLowerCase(), courseId: Number(courseId), amount: Number(amount) } }),
            prismaClient_1.prisma.user.update({ where: { id: courseCreator.toLowerCase() }, data: { payout: { increment: amount } } })
        ]);
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
});
exports.CoursePurchased = CoursePurchased;
