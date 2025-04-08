import { prisma } from "./prismaClient"; 

export const createCourse = async ({ courseId, name, courseCreator, educatorName }: { courseId: number, name: string, courseCreator: string, educatorName: string }) => {
    try{
        const result = await prisma.courses.create({
            data: {
                courseId: Number(courseId),
                name: name,
                educatorId: courseCreator.toLowerCase(),
                educatorName: educatorName,
            }
        })
        console.log(result);
    }catch(e){
        console.log(e);
    }
}


export const CoursePurchased = async({purchaser, courseId, amount,courseCreator} : {purchaser : string , courseId : number,amount : number,courseCreator : string}) => {
    try {
        const result = await prisma.$transaction([
            prisma.purchases.create({data : {userId: purchaser.toLowerCase() ,courseId : Number(courseId), amount : Number(amount)}}),
            prisma.user.update({where : {id : courseCreator.toLowerCase()} , data : {payout : {increment : amount}}})
        ])
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}