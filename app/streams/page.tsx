
// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams } from "next/navigation";

// type Stream = {
//   id: string;
//   extracedId: string;
//   title?: string;
//   thumbnail?: { url: string };
//   upvotes: number;
//   hasUpvoted?: boolean;
// };

// export default function StreamsPage() {
//   const params = useSearchParams();
//   const creatorId = params.get("creatorId");
//   const [streams, setStreams] = useState<Stream[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newStreamId, setNewStreamId] = useState("");
//   const [adding, setAdding] = useState(false);

//   const playerRef = useRef<any>(null);

//   // Fetch streams
//   useEffect(() => {
//     const fetchStreams = async () => {
//       try {
//         const res = await fetch(`/api/streams?creatorId=${creatorId}`);
//         const data = await res.json();
//         if (res.ok && data.streams) {
//           // filter out invalid streams
//           const validStreams: Stream[] = data.streams.filter(
//             (s: any) => s?.id && s?.extracedId
//           );
//           setStreams(validStreams);
//         }
//       } catch (err) {
//         console.error("Error fetching streams:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (creatorId) fetchStreams();
//   }, [creatorId]);

//   // Initialize YouTube player
//   useEffect(() => {
//     if (!streams.length) return;

//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";
//     document.body.appendChild(tag);

//     // @ts-ignore
//     window.onYouTubeIframeAPIReady = () => {
//       // @ts-ignore
//       playerRef.current = new YT.Player("yt-player", {
//         videoId: streams[0].extracedId,
//         events: {
//           onStateChange: (event: any) => {
//             if (event.data === 0) { // 0 is YT.PlayerState.ENDED
//               playNextStream();
//             }
//           },
//         },
//       });
//     };
//   }, [streams]);

//   // Load current stream
//   const playNextStream = () => {
//     setStreams((prev) => {
//       if (!prev.length) return [];
//       const [, ...remaining] = prev; // remove the first stream after playing
//       if (remaining.length && playerRef.current) {
//         playerRef.current.loadVideoById(remaining[0].extracedId);
//       }
//       return remaining;
//     });
//   };

//   const handleToggleUpvote = async (streamId: string) => {
//     try {
//       const stream = streams.find((s) => s.id === streamId);
//       if (!stream) return;

//       const res = await fetch(`/api/streams/upvotes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ streamId, action: stream.hasUpvoted ? "remove" : "upvote" }),
//       });
//       const data = await res.json();

//       setStreams((prev) =>
//         prev.map((s) =>
//           s.id === streamId
//             ? {
//                 ...s,
//                 upvotes: data.upvotes ?? s.upvotes,
//                 hasUpvoted: !s.hasUpvoted,
//               }
//             : s
//         )
//       );
//     } catch (err) {
//       console.error("Error toggling upvote:", err);
//     }
//   };

//   const handleAddStream = async () => {
//     if (!newStreamId.trim()) return alert("Enter a valid Stream ID");
//     setAdding(true);
//     try {
//       const res = await fetch(`/api/streams`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ creatorId, url: newStreamId }),
//       });
//       const data = await res.json();
//       if (res.ok && data.stream?.id && data.stream.extracedId) {
//         setStreams((prev) => [...prev, data.stream]);
//         setNewStreamId("");
//       } else {
//         alert(data.message || "Failed to add stream");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error adding stream");
//     } finally {
//       setAdding(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         Loading streams...
//       </div>
//     );
//   }

//   if (!streams.length) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white gap-4">
//         No streams found for this creator.
//       </div>
//     );
//   }

//   // sort queue by upvotes descending, skip first stream which is playing
//   const queue = streams.slice(1).sort((a, b) => b.upvotes - a.upvotes);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🎵 Stream Queue</h1>

//       {/* Add stream input */}
//       <div className="max-w-4xl mx-auto flex gap-2 mb-6">
//         <input
//           type="text"
//           value={newStreamId}
//           onChange={(e) => setNewStreamId(e.target.value)}
//           placeholder="Enter YouTube Stream ID"
//           className="flex-1 p-2 rounded-md bg-gray-800 text-white outline-none"
//         />
//         <button
//           onClick={handleAddStream}
//           disabled={adding}
//           className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:bg-gray-600"
//         >
//           {adding ? "Adding..." : "Add Stream"}
//         </button>
//       </div>

//       {/* Main video */}
//       <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
//         <div id="yt-player" className="w-full h-full"></div>
//       </div>

//       {/* Queue */}
//       <div className="space-y-4 max-w-3xl mx-auto">
//         {queue.map((stream) => {
//           if (!stream || !stream.extracedId) return null;

//           return (
//             <div
//               key={stream.id}
//               className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
//             >
//               <img
//                 src={
//                   stream.thumbnail?.url ||
//                   `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`
//                 }
//                 alt={stream.title || "Untitled Stream"}
//                 className="w-28 h-16 object-cover rounded-md cursor-pointer"
//                 onClick={() => playerRef.current?.loadVideoById(stream.extracedId)}
//               />
//               <p className="flex-1 text-lg">{stream.title || "Untitled Stream"}</p>
//               <button
//                 onClick={() => handleToggleUpvote(stream.id)}
//                 className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
//                   stream.hasUpvoted ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 👍 {stream.upvotes ?? 0}
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";

type Stream = {
  id: string;
  extracedId: string;
  title?: string;
  thumbnail?: { url: string };
  upvotes: number;
  hasUpvoted?: boolean;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function StreamsPage() {
  const params = useSearchParams();
  const creatorId = params.get("creatorId");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStreamId, setNewStreamId] = useState("");
  const [adding, setAdding] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef = useRef<any>(null);

  // Fetch streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(`/api/streams?creatorId=${creatorId}`);
        const data = await res.json();

        if (res.ok && data.streams) {
          const validStreams: Stream[] = data.streams.filter(
            (s: any) => s?.id && s?.extracedId
          );

          // sort by upvotes DESC immediately
          validStreams.sort((a, b) => b.upvotes - a.upvotes);
          setStreams(validStreams);
        }
      } catch (err) {
        console.error("Error fetching streams:", err);
      } finally {
        setLoading(false);
      }
    };
    if (creatorId) fetchStreams();
  }, [creatorId]);

  // Load YouTube API safely
  useEffect(() => {
    if (!streams.length) return;

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        const scriptTag = document.createElement("script");
        scriptTag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(scriptTag);
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    };

    const initPlayer = () => {
      if (!streams[0]) return;

      if (!playerRef.current) {
        playerRef.current = new window.YT.Player("yt-player", {
          videoId: streams[0].extracedId,
          events: {
            onReady: () => setPlayerReady(true),
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                playNextStream();
              }
            },
          },
        });
      } else {
        playerRef.current.loadVideoById(streams[0].extracedId);
      }
    };

    loadYouTubeAPI();
  }, [streams]);

  const playNextStream = () => {
    setStreams((prev) => {
      if (prev.length <= 1) return prev;
      const [, ...remaining] = prev;
      const sortedRemaining = [...remaining].sort((a, b) => b.upvotes - a.upvotes);
      if (playerRef.current && sortedRemaining[0]) {
        playerRef.current.loadVideoById(sortedRemaining[0].extracedId);
      }
      return sortedRemaining;
    });
  };

  const handleToggleUpvote = async (streamId: string) => {
    try {
      const stream = streams.find((s) => s.id === streamId);
      if (!stream) return;

      const res = await fetch(`/api/streams/upvotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamId,
          action: stream.hasUpvoted ? "remove" : "upvote",
        }),
      });
      const data = await res.json();

      setStreams((prev) =>
        [...prev].map((s) =>
          s.id === streamId
            ? {
                ...s,
                upvotes: data.upvotes ?? s.upvotes,
                hasUpvoted: !s.hasUpvoted,
              }
            : s
        ).sort((a, b) => b.upvotes - a.upvotes) // ✅ live re-sort
      );
    } catch (err) {
      console.error("Error toggling upvote:", err);
    }
  };

  const handleAddStream = async () => {
    if (!newStreamId.trim()) return alert("Enter a valid Stream ID");
    setAdding(true);
    try {
      const res = await fetch(`/api/streams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId, url: newStreamId }),
      });
      const data = await res.json();

      if (res.ok && data.stream?.id && data.stream.extracedId) {
        setStreams((prev) =>
          [...prev, data.stream].sort((a, b) => b.upvotes - a.upvotes)
        );
        setNewStreamId("");
      } else {
        alert(data.message || "Failed to add stream");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding stream");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Loading streams...
      </div>
    );
  }

  if (!streams.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white gap-4">
        No streams found for this creator.
      </div>
    );
  }

  const currentVideo = streams[0];
  const queue = streams.slice(1); // already sorted

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🎵 Stream Queue</h1>

      {/* Add Stream */}
      <div className="max-w-4xl mx-auto flex gap-2 mb-6">
        <input
          type="text"
          value={newStreamId}
          onChange={(e) => setNewStreamId(e.target.value)}
          placeholder="Enter YouTube Stream ID"
          className="flex-1 p-2 rounded-md bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleAddStream}
          disabled={adding}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:bg-gray-600"
        >
          {adding ? "Adding..." : "Add Stream"}
        </button>
      </div>

      {/* Main YouTube Player */}
      <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
        <div id="yt-player" className="w-full h-full"></div>
      </div>

      {/* Queue */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {queue.map((stream) => (
          <div
            key={stream.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
          >
            <img
              src={
                stream.thumbnail?.url ||
                `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`
              }
              alt={stream.title || "Untitled Stream"}
              className="w-28 h-16 object-cover rounded-md cursor-pointer"
              onClick={() => {
                if (playerReady && playerRef.current)
                  playerRef.current.loadVideoById(stream.extracedId);
              }}
            />
            <p className="flex-1 text-lg">{stream.title || "Untitled Stream"}</p>
            <button
              onClick={() => handleToggleUpvote(stream.id)}
              className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
                stream.hasUpvoted
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              👍 {stream.upvotes ?? 0}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
