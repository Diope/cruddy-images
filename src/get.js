const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
    console.log(event);

    const response = {
        isBase64Encoded: false, // wow man...based64?
        statusCode: 200
    }

    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: decodeURIComponent(event.pathParameters.fileKey) 
        }

        // console.log(params);
        const data = await s3.getObject(params).promise();
        response.body = JSON.stringify({message: "Image retrieved", data})
        // console.log('data :>> ', data);
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({message: "Error in retreving files.", errorMessage: e});
        response.statusCode = 500; 
    }
    return reponse;
    // console.log('response :>> ', response);
};