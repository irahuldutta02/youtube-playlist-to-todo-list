const { SERVER_URL, NODE_ENV, YOUTUBE_API_KEY } = require("../server.config");
const axios = require("axios");
const { parseDurationToMilliseconds } = require("../util");

/**
 * @description Controller to handle the ping request.
 * @path GET /ping
 * @path GET /api/ping
 */
const pingController = (req, res) => {
  res.status(200).json({
    status: 200,
    requestDescription: "GET request to check the route is up or not.",
    message: "Server Is Up!",
    originalUrl: SERVER_URL + req.originalUrl,
  });
};

/**
 * @description Controller to handle the playlist to todo list request.
 * @path GET /api/playlist-to-todo-list
 */
const playListToToDoList = (req, res) => {
  res.status(200).json({
    status: 200,
    requestDescription: "GET request to check the route is up or not.",
    message: "Server Is Up!",
    originalUrl: SERVER_URL + req.originalUrl,
  });
};

const getVideosFromPlaylist = async (req, res) => {
  try {
    const playlistUrl = req.body.playlist;

    console.log("playlistUrl", playlistUrl);

    // Extract playlist ID from URL
    const playlistId = playlistUrl.match(/list=([^&]+)/)[1];

    let nextPageToken = null;
    let allVideos = [];

    // Fetch all pages of playlist items from YouTube API
    do {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: playlistId,
            key: YOUTUBE_API_KEY,
            maxResults: 50, // adjust as needed
            pageToken: nextPageToken,
          },
        }
      );

      // Concatenate new videos to the list
      allVideos = allVideos.concat(response.data.items);

      // Update nextPageToken for the next iteration
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    const videoDetailsPromises = allVideos.map((item) => {
      // Fetch video details including duration
      return axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
          part: "contentDetails",
          id: item.snippet.resourceId.videoId,
          key: YOUTUBE_API_KEY,
        },
      });
    });

    const videoDetailsResponses = await Promise.all(videoDetailsPromises);

    const videos = allVideos.map((item, index) => {
      const videoDetails = videoDetailsResponses[index].data.items[0]; // Assuming each response contains only one item
      const duration = videoDetails
        ? videoDetails.contentDetails.duration
        : "Unknown";

      return {
        title: item.snippet.title,
        videoID: item.snippet.resourceId.videoId,
        url: `https://youtu.be/${item.snippet.resourceId.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
        embedUrlWithPlaylistId: `https://www.youtube.com/embed/watch?v=${
          item.snippet.resourceId.videoId
        }&list=${playlistId}&index=${index + 1}`,
        playlistId: playlistId,
        playlistUrl: playlistUrl,
        embedPlaylistUrl: `https://www.youtube.com/embed/watch?v=${item.snippet.resourceId.videoId}&list=${playlistId}`,
        duration: duration,
        durationMilliseconds: parseDurationToMilliseconds(duration),
      };
    });

    res.status(200).json({
      status: 200,
      description: "GET request to get the videos from the playlist.",
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: "Internal Server Error",
      stack:
        NODE_ENV === "development" ? error.stack : "🤫 You are in production.",
    });
  }
};

module.exports = {
  pingController,
  getVideosFromPlaylist,
};
