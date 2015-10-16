/**
 * Created by Eamonn on 2015/10/15.
 */
var MongoClient = require('mongodb').MongoClient;
var ObjectID=require('mongodb').ObjectID;
var multidrawDb;

exports.connectDb=function(url, next){
    MongoClient.connect(url, function(err, dbInstance) {
        if(err){
            console.log('ERROR: Connection to database cannot to be established. \n' +
                'Please check if the database has been started.');
        }else{
            console.log("Database connection established.");
            multidrawDb=dbInstance;
            next();
        }


    });
};
exports.getDB=function(){
    return multidrawDb;
};
exports.getObjectId=function(){
    return ObjectID;
};
