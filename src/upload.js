const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async (event) => {
    console.log(event);
    let response;

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({message: "Upload was successful"}) // Apparently you HAVE to stringify the json
    }

    try {
        const parsedBody = JSON.parse(event.body);
        // console.log({parsedBody});
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        // console.log({decodedFile});
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString()}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg"
        }

        const uploadResult = await s3.upload(params).promise();

        // console.log('uploadResult :>> ', uploadResult);
        response.body = JSON.stringify({message: "Upload was successful", uploadResult})
    }catch (e) {
        console.error("File failed to upload: ", e);
        response.body = JSON.stringify({message: "File failed.", errorMessage: e})
        response.statusCode = 500;
    }
    return response;
}