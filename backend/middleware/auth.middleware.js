import jwt from "jsonwebtoken";
import qs from 'qs';
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log('Token from cookies:', token);

    if (!token) {
      const queryParams = qs.parse(req.url.split('?')[1]);
      console.log('Query Parameters:', queryParams);
      const authQueryKey = 'Authorization '; 
      const authQuery = queryParams[authQueryKey];

      if (authQuery) {
        const bearerToken = authQuery.replace('Bearer ', ''); 
        token = bearerToken;
        console.log('Extracted Token:', token);
      } else if (req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.split(" ")[1];
        }
      }
    }

    console.log('Final Token:', token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized User Token" });
    }

    const isBlackListed = await redisClient.get(token);

    if (isBlackListed){ // Update the condition to check if the token is blacklisted
      res.cookie('token', '');
      return res.status(401).send({error:"Unauthorized User Token in BlackListed"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    req.user = decoded;
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};