import { NextFunction, Request, Response } from "express";


const middleWare = (req : Request, res : Response ,next : NextFunction) => {

    next();
}

export default middleWare;