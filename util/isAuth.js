const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const error = new Error('No header found!!!');
        error.statusCode = 404;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token , 'secret')
    try{

        if(!decodedToken){
            const error = new Error('User Token donot match!!!');
            error.statusCode = 404;
            throw error;
        }
        //res.status(200).json({message : 'Token is matching'});
        req.userId = decodedToken.userId;
        next();
    
    }
    catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}





