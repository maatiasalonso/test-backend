const AWS = require("aws-sdk");
const { google } = require("googleapis");
const apiKey = "AIzaSyBidDSHBjXC7YmrBj7HXY-oT07EIS3cyH4";
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

module.exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const res = await dynamodb
    .scan({
      TableName: "VideosTable",
      ScanIndexForward: false,
    })
    .promise();

  res.Items.sort((a, b) => {
    const createdAtA = new Date(a.createdAt);
    const createdAtB = new Date(b.createdAt);

    return createdAtB - createdAtA;
  });

  const videosId = [];

  res.Items.forEach((item) => {
    videosId.push(item.videoId);
  });

  const response = await youtube.videos.list({
    part: "snippet, contentDetails",
    id: videosId,
  });

  const videos = response.data.items;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
    body: JSON.stringify(videos),
  };
};
