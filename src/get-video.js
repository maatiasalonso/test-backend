const AWS = require("aws-sdk");
const { google } = require("googleapis");
const apiKey = "AIzaSyBidDSHBjXC7YmrBj7HXY-oT07EIS3cyH4";
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

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

  const response = await youtube.videos.list({
    part: "snippet, contentDetails",
    id: res.Items[0].videoId,
  });

  const video = response.data.items[0];

  const data = {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.default.url,
  };

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    },
    body: JSON.stringify(data),
  };
};
