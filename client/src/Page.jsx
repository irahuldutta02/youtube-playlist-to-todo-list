import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export function Page() {
  const [url, setUrl] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  const getPlaylist = async (url) => {
    setError(null);
    setPlaylist([]);
    try {
      setState("loading");
      const res = await axios.post(
        "http://localhost:5000/api/get-videos-from-playlist",
        {
          playlist: url,
        }
      );
      setPlaylist(res?.data?.data);
      setState("success");
    } catch (error) {
      setError(error);
      setState("error");
    }
  };

  const isValidYouTubePlaylistUrl = (url) => {
    // Regular expression to match YouTube playlist URLs
    const regex =
      /^https?:\/\/(?:www\.)?youtube\.com\/playlist\?list=[\w-]+(?:&.*)?$/;

    // Test the URL against the regular expression
    return regex.test(url);
  };

  const handleSubmit = () => {
    if (!isValidYouTubePlaylistUrl(url)) {
      toast.error("Invalid YouTube Playlist URL");
      return;
    }
    if (url.trim() === "") {
      toast.error("Please enter a valid YouTube Playlist URL");
      return;
    }

    getPlaylist(url);
  };

  useEffect(() => {
    if (playlist.length === 0) return;

    const markdown = playlist
      .map((item, index) => {
        const videoUrl = `https://www.youtube.com/embed/${item.videoID}?list=${
          item.playlistId
        }&index=${index + 1}`;
        const duration = formatTime(item.durationMilliseconds); // Corrected function name

        return `- [ ] **${index+1}. [${item.title}](${videoUrl}) [ ${duration} ]**`;
      })
      .join("\n");

    const totalDuration = getTotalDuration(playlist);
    const totalDurationFormatted = formatTime(totalDuration); // Corrected function name

    setMarkdown(`
  ### [Playlist](${playlist[0].playlistUrl})
  **Total Duration: [ ${totalDurationFormatted} ]**
  ${markdown}
  `);
  }, [playlist]);

  function formatTime(milliseconds) {
    // Convert milliseconds to seconds
    let seconds = Math.floor(milliseconds / 1000);

    // Calculate days
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;

    // Calculate hours
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    // Calculate minutes
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    // Remaining seconds
    seconds = seconds % 60;

    // Format the result
    // const result = `${days} D : ${hours} H : ${minutes} M : ${seconds} S`;

    return `${days ? days + " D : " : ""}${hours ? hours + " H : " : ""}${
      minutes ? minutes + " M : " : ""
    }${seconds} S`;
    // return result;
  }

  // Function to get total duration of the playlist
  const getTotalDuration = (playlist) => {
    return playlist.reduce(
      (total, item) => total + item.durationMilliseconds,
      0
    );
  };

  const handleReset = () => {
    setUrl("");
    setPlaylist([]);
    setState("idle");
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <>
      <div className="flex justify-start items-center flex-col gap-4 w-full min-h-screen pb-10">
        <div className="flex justify-start items-center flex-col gap-8 w-full max-w-6xl p-4">
          <div className="flex w-full flex-col gap-4">
            <h1 className="text-3xl text-center gap-4">
              Youtube Playlist To Markdown ToDo List
            </h1>
            <p className="text-center">
              After copying the markdown paste it in a new notion page using
              `ctrl+shift+v`
            </p>
          </div>
          <div className="w-full flex justify-center items-center flex-col">
            <div className="w-full flex justify-center items-center gap-4">
              <input
                type="text"
                placeholder="Input the Playlist url"
                className="input input-bordered w-full max-w-xs input-sm"
                value={url}
                onChange={(e) => {
                  setState("idle");
                  setPlaylist([]);
                  setError(null);
                  setUrl(e.target.value);
                }}
              />

              <button onClick={handleSubmit} className="btn btn-sm btn-primary">
                Submit
              </button>
              <button onClick={handleReset} className="btn btn-sm btn-accent">
                Reset
              </button>
            </div>
          </div>
          <div className="flex w-full justify-center items-center gap-4">
            {error && (
              <div className="flex w-full flex-col gap-4">
                <p className="text-center text-red-500">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            )}
            {state === "loading" && (
              <span className="loading loading-dots loading-lg"></span>
            )}
            {state === "success" && (
              <>
                <button className="btn btn-accent btn-sm" onClick={handleCopy}>
                  Copy
                </button>
                <button
                  onClick={() => {
                    window.open("https://notion.so/new");
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Go to notion.so/new
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
