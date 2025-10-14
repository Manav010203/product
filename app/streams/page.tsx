// // "use client";

// // import { useSession } from "next-auth/react";
// // import { useRouter } from "next/navigation";
// // import { useState } from "react";

// // export default function AddCreatorId() {
// //   const { data: session, status } = useSession();
// //   const [loading, setLoading] = useState(false);
// //   const [creatorId, setCreatorId] = useState("");
// //   const router = useRouter()

// //   const handleSubmit = async () => {
// //     if (!creatorId.trim()) {
// //       return alert("Please enter the creator ID");
// //     }
// //     setLoading(true);
// //     try {
// //       const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
// //         method: "GET",
// //         headers: { "Content-Type": "application/json" },
// //       });

// //       const data = await res.json();
// //       console.log("Response:", data);
// //        if (res.ok && data.streams?.length > 0) {
// //         // ✅ Redirect to /streams page with creatorId
// //         router.push(`/streams?creatorId=${creatorId}`);
// //       } else {
// //         alert("No streams found for this creator.");
// //       }
// //     } catch (e) {
// //       console.error("Error fetching streams:", e);
// //       alert("Failed to fetch streams.");
// //     } finally {
// //       setLoading(false);
// //     }
// // };

// //   // 🔄 Show loading animation
// //   if (status === "loading" || loading) {
// //     return (
// //       <div className="bg-white dark:bg-gray-800 flex justify-center items-center w-screen h-screen p-5">
// //         <div className="text-center p-6">
// //           <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-[#714F04] mx-auto"></div>
// //           <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
// //           <p className="text-zinc-600 dark:text-zinc-400">
// //             Your adventure is about to begin
// //           </p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // 🚫 If not signed in
// //   if (!session) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
// //         <p>Please sign in to add a creator ID.</p>
// //       </div>
// //     );
// //   }

// //   // ✅ Main UI
// //   return (
// //     <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center">
// //       <div className="flex items-center bg-gray-900 p-4 rounded-md max-w-xl w-full mx-4">
// //         <span className="text-green-500 text-xl">&gt;</span>
// //         <input
// //           type="text"
// //           value={creatorId}
// //           onChange={(e) => setCreatorId(e.target.value)}
// //           className="bg-gray-900 text-white p-1 outline-none ml-2 w-full"
// //           placeholder="Type the Creator Code You want the streams for"
// //         />
// //         <button
// //           onClick={handleSubmit} // ✅ missing in your version
// //           disabled={loading}
// //           className="ml-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-1.5 px-4 rounded-md transition-colors duration-200"
// //         >
// //           {loading ? "Loading..." : "Submit"}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// export default function stremas(){
//     return(
//         <div>
//             Hello from creator
//         </div>
//     )
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// export default function StreamsPage() {
//   const params = useSearchParams();
//   const creatorId = params.get("creatorId");
//   const [streams, setStreams] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchStreams = async () => {
//       try {
//         const res = await fetch(`/api/streams?creatorId=${creatorId}`);
//         const data = await res.json();
//         if (res.ok) setStreams(data.streams || []);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (creatorId) fetchStreams();
//   }, [creatorId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         Loading streams...
//       </div>
//     );
//   }

//   if (!streams.length) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         No streams found for this creator.
//       </div>
//     );
//   }

//    // main video
//   const mainVideo = streams[currentIndex];
//   const queue = streams.filter((_, i) => i !== currentIndex);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
//         🎵 Stream Queue
//       </h1>

//       {/* Top embedded video */}
//       {mainVideo && (
//         <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
//           <iframe
//             className="w-full h-full"
//             src={`https://www.youtube.com/embed/${mainVideo.extracedId}`}
//             title={mainVideo.title ?? "Main Stream"}
//             allowFullScreen
//           ></iframe>
//         </div>
//       )}

//       {/* Queue list with thumbnails */}
//       <div className="space-y-4 max-w-3xl mx-auto">
//         {queue.map((stream) => (
//           <div
//             key={stream.id}
//             className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
//           >
//             {/* Thumbnail */}
//             <img
//               src={stream.thumbnail?.url ?? `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`}
//               alt={stream.title}
//               className="w-28 h-16 object-cover rounded-md cursor-pointer"
//               onClick={() => setCurrentIndex(streams.findIndex(s => s.id === stream.id))} // click to play
//             />

//             {/* Title */}
//             <p className="flex-1 text-lg">{stream.title ?? "Untitled Stream"}</p>

//             {/* Upvote/Downvote */}
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleVote(stream.id, "upvotes")}
//                 className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md"
//               >
//                 👍 {stream.upvote}
//               </button>
//               <button
//                 onClick={() => handleVote(stream.id, "downvote")}
//                 className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
//               >
//                 👎
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// async function handleVote(streamId: string, type: "upvotes" | "downvote") {
//   try {
//     const res = await fetch(`/api/streams/${type}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ streamId, type }),
//     });
//     const data = await res.json();
//     console.log("Vote response:", data);
//   } catch (err) {
//     console.error("Error voting:", err);
//   }
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// type Stream = {
//   id: string;
//   extracedId: string;
//   title?: string;
//   thumbnail?: { url: string };
//   upvotes: number;
//   hasUpvoted?: boolean; // track if current user has upvoted
// };

// export default function StreamsPage() {
//   const params = useSearchParams();
//   const creatorId = params.get("creatorId");
//   const [streams, setStreams] = useState<Stream[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const mainVideo = streams[currentIndex];


//   useEffect(() => {
//     const fetchStreams = async () => {
//       try {
//         const res = await fetch(`/api/streams?creatorId=${creatorId}`);
//         const data = await res.json();
//         if (res.ok && data.streams) setStreams(data.streams);
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (creatorId) fetchStreams();
//   }, [creatorId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         Loading streams...
//       </div>
//     );
//   }

//   if (!streams.length) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
//         No streams found for this creator.
//       </div>
//     );
//   }

//   // Sort remaining streams by upvotes descending
//   const queue = streams
//     .filter((_, i) => i !== currentIndex)
//     .sort((a, b) => b.upvotes - a.upvotes);

//   const handleToggleUpvote = async (streamId: string) => {
//     try {
//       const stream = streams.find((s) => s.id === streamId);
//       if (!stream) return;

//       const action = stream.hasUpvoted ? "remove" : "upvote";

//       const res = await fetch(`/api/streams/upvotes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ streamId, action:stream.hasUpvoted ? "remove" :"upvote" }),
//       });
//       const data = await res.json();
//       console.log("Vote response:", data);

//       // Update local state
//       setStreams((prev) =>
//         prev.map((s) =>
//           s.id === streamId
//             ? {
//                 ...s,
//                 upvotes: s.hasUpvoted ? (s.upvotes ?? 0) - 1 : (s.upvotes ?? 0) + 1,
//                 hasUpvoted: !s.hasUpvoted,
//               }
//             : s
//         )
//       );
//     } catch (err) {
//       console.error("Error toggling upvote:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
//         🎵 Stream Queue
//       </h1>

//       {/* Main video */}
//       {mainVideo && (
//         <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
//           <iframe
//             className="w-full h-full"
//             src={`https://www.youtube.com/embed/${mainVideo.extracedId}`}
//             title={mainVideo.title ?? "Main Stream"}
//             allowFullScreen
//           ></iframe>
//         </div>
//       )}

//       {/* Queue */}
//       <div className="space-y-4 max-w-3xl mx-auto">
//         {queue.map((stream) => (
//           <div
//             key={stream.id}
//             className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
//           >
//             {/* Thumbnail */}
//             <img
//               src={stream.thumbnail?.url ?? `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`}
//               alt={stream.title}
//               className="w-28 h-16 object-cover rounded-md cursor-pointer"
//               onClick={() =>
//                 setCurrentIndex(streams.findIndex((s) => s.id === stream.id))
//               }
//             />

//             {/* Title */}
//             <p className="flex-1 text-lg">{stream.title ?? "Untitled Stream"}</p>

//             {/* Toggle upvote button */}
//             <button
//               onClick={() => handleToggleUpvote(stream.id)}
//               className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
//                 stream.hasUpvoted
//                   ? "bg-green-700 hover:bg-green-800"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               👍 {stream.upvotes}
//             </button>
//           </div>
//         ))}
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

export default function StreamsPage() {
  const params = useSearchParams();
  const creatorId = params.get("creatorId");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStreamId, setNewStreamId] = useState("");
  const [adding, setAdding] = useState(false);

  const playerRef = useRef<any>(null);

  // Fetch streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch(`/api/streams?creatorId=${creatorId}`);
        const data = await res.json();
        if (res.ok && data.streams) {
          // filter out invalid streams
          const validStreams: Stream[] = data.streams.filter(
            (s: any) => s?.id && s?.extracedId
          );
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

  // Initialize YouTube player
  useEffect(() => {
    if (!streams.length) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // @ts-ignore
    window.onYouTubeIframeAPIReady = () => {
      // @ts-ignore
      playerRef.current = new YT.Player("yt-player", {
        videoId: streams[0].extracedId,
        events: {
          onStateChange: (event: any) => {
            if (event.data === YT.PlayerState.ENDED) {
              playNextStream();
            }
          },
        },
      });
    };
  }, [streams]);

  // Load current stream
  const playNextStream = () => {
    setStreams((prev) => {
      if (!prev.length) return [];
      const [, ...remaining] = prev; // remove the first stream after playing
      if (remaining.length && playerRef.current) {
        playerRef.current.loadVideoById(remaining[0].extracedId);
      }
      return remaining;
    });
  };

  const handleToggleUpvote = async (streamId: string) => {
    try {
      const stream = streams.find((s) => s.id === streamId);
      if (!stream) return;

      const res = await fetch(`/api/streams/upvotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId, action: stream.hasUpvoted ? "remove" : "upvote" }),
      });
      const data = await res.json();

      setStreams((prev) =>
        prev.map((s) =>
          s.id === streamId
            ? {
                ...s,
                upvotes: data.upvotes ?? s.upvotes,
                hasUpvoted: !s.hasUpvoted,
              }
            : s
        )
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
        setStreams((prev) => [...prev, data.stream]);
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

  // sort queue by upvotes descending, skip first stream which is playing
  const queue = streams.slice(1).sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🎵 Stream Queue</h1>

      {/* Add stream input */}
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

      {/* Main video */}
      <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
        <div id="yt-player" className="w-full h-full"></div>
      </div>

      {/* Queue */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {queue.map((stream) => {
          if (!stream || !stream.extracedId) return null;

          return (
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
                onClick={() => playerRef.current?.loadVideoById(stream.extracedId)}
              />
              <p className="flex-1 text-lg">{stream.title || "Untitled Stream"}</p>
              <button
                onClick={() => handleToggleUpvote(stream.id)}
                className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
                  stream.hasUpvoted ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                👍 {stream.upvotes ?? 0}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
