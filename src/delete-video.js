const AWS = require("aws-sdk");

module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const videoId = event.pathParameters.id;

  const res = await dynamodb
    .scan({
      TableName: "VideosTable",
      FilterExpression: "videoId = :videoId",
      ExpressionAttributeValues: {
        ":videoId": videoId,
      },
    })
    .promise();

  await dynamodb
    .delete({
      TableName: "VideosTable",
      Key: {
        id: res.Items[0].id,
      },
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST, DELETE, GET",
    },
    body: JSON.stringify({ message: "Video eliminado correctamente!" }),
  };
};
