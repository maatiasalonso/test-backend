const { v4 } = require("uuid");
const AWS = require("aws-sdk");
module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { videoId } = JSON.parse(event.body);
  const createdAt = new Date().toISOString();
  const id = v4();

  const existingVideo = await dynamodb
    .scan({
      TableName: "VideosTable",
      FilterExpression: "videoId = :videoId",
      ExpressionAttributeValues: {
        ":videoId": videoId,
      },
    })
    .promise();

  if (existingVideo.Count > 0) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST, GET",
      },
      body: JSON.stringify({
        message: "El video que intenta agregar ya existe!",
      }),
    };
  }

  const newVideo = {
    id,
    videoId,
    createdAt,
  };

  await dynamodb
    .put({
      TableName: "VideosTable",
      Item: newVideo,
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
    },
    body: JSON.stringify({
      message: "Se ha añadido el video correctamente!",
    }),
  };
};
