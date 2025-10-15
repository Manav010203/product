

// // "use client";

// // import { useEffect, useState, useRef } from "react";


// // export const dynamic = "force-dynamic";
// // import { useSearchParams } from "next/navigation";

// // type Stream = {
// //   id: string;
// //   extracedId: string;
// //   title?: string;
// //   thumbnail?: { url: string };
// //   upvotes: number;
// //   hasUpvoted?: boolean;
// // };

// // declare global {
// //   interface Window {
// //     YT: any;
// //     onYouTubeIframeAPIReady: () => void;
// //   }
// // }

// // export default function StreamsPage() {
// //   const params = useSearchParams();
// //   const creatorId = params.get("creatorId");
// //   const [streams, setStreams] = useState<Stream[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [newStreamId, setNewStreamId] = useState("");
// //   const [adding, setAdding] = useState(false);
// //   const [playerReady, setPlayerReady] = useState(false);
// //   const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

// //   const playerRef = useRef<any>(null);

// //   // ✅ Fetch streams
// //   useEffect(() => {
// //     const fetchStreams = async () => {
// //       try {
// //         const res = await fetch(`/api/streams?creatorId=${creatorId}`);
// //         const data = await res.json();

// //         if (res.ok && data.streams) {
// //           const validStreams: Stream[] = data.streams.filter(
// //             (s: any) => s?.id && s?.extracedId
// //           );

// //           validStreams.sort((a, b) => b.upvotes - a.upvotes);
// //           setStreams(validStreams);
// //           if (!currentStreamId && validStreams.length > 0) {
// //             setCurrentStreamId(validStreams[0].id); // 🎯 Set first as current
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Error fetching streams:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     if (creatorId) fetchStreams();
// //   }, [creatorId]);

// //   // ✅ Initialize YouTube player only once
// //   useEffect(() => {
// //     if (!streams.length || !currentStreamId) return;

// //     const loadYouTubeAPI = () => {
// //       if (window.YT && window.YT.Player) {
// //         initPlayer();
// //       } else {
// //         const scriptTag = document.createElement("script");
// //         scriptTag.src = "https://www.youtube.com/iframe_api";
// //         document.body.appendChild(scriptTag);
// //         window.onYouTubeIframeAPIReady = initPlayer;
// //       }
// //     };

// //     const initPlayer = () => {
// //       const currentStream = streams.find((s) => s.id === currentStreamId);
// //       if (!currentStream) return;

// //       if (!playerRef.current) {
// //         playerRef.current = new window.YT.Player("yt-player", {
// //           videoId: currentStream.extracedId,
// //           events: {
// //             onReady: () => setPlayerReady(true),
// //             onStateChange: (event: any) => {
// //               if (event.data === window.YT.PlayerState.ENDED) playNextStream();
// //             },
// //           },
// //         });
// //       } else if (playerReady && typeof playerRef.current.loadVideoById === "function") {
// //         // only load when streamId changes
// //         playerRef.current.loadVideoById(currentStream.extracedId);
// //       }
// //     };

// //     loadYouTubeAPI();
// //   }, [currentStreamId]);

// //   // ✅ Play next stream by upvotes
// //   const playNextStream = () => {
// //     setStreams((prev) => {
// //       const sorted = [...prev].sort((a, b) => b.upvotes - a.upvotes);
// //       const currentIndex = sorted.findIndex((s) => s.id === currentStreamId);
// //       const next = sorted[currentIndex + 1] || sorted[0];
// //       if (next && next.id !== currentStreamId) {
// //         setCurrentStreamId(next.id);
// //       }
// //       return sorted;
// //     });
// //   };

// //   // ✅ Upvote/downvote without restarting video
// //   const handleToggleUpvote = async (streamId: string) => {
// //     try {
// //       const res = await fetch(`/api/streams/upvotes`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           streamId,
// //           action:
// //             streams.find((s) => s.id === streamId)?.hasUpvoted
// //               ? "remove"
// //               : "upvote",
// //         }),
// //       });

// //       const data = await res.json();
// //       setStreams((prev) => {
// //         const updated = prev.map((s) =>
// //           s.id === streamId
// //             ? {
// //                 ...s,
// //                 upvotes: data.upvotes ?? s.upvotes,
// //                 hasUpvoted: !s.hasUpvoted,
// //               }
// //             : s
// //         );

// //         // sort queue but do NOT reload current video
// //         const sorted = updated.sort((a, b) => b.upvotes - a.upvotes);
// //         return sorted;
// //       });
// //     } catch (err) {
// //       console.error("Error toggling upvote:", err);
// //     }
// //   };

// //   // ✅ Add new stream
// //   const handleAddStream = async () => {
// //     if (!newStreamId.trim()) return alert("Enter a valid Stream ID");
// //     setAdding(true);
// //     try {
// //       const res = await fetch(`/api/streams`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ creatorId, url: newStreamId }),
// //       });
// //       const data = await res.json();

// //       if (res.ok && data.stream?.id && data.stream.extracedId) {
// //         setStreams((prev) =>
// //           [...prev, data.stream].sort((a, b) => b.upvotes - a.upvotes)
// //         );
// //         setNewStreamId("");
// //       } else {
// //         alert(data.message || "Failed to add stream");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error adding stream");
// //     } finally {
// //       setAdding(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
// //         Loading streams...
// //       </div>
// //     );
// //   }

// //   if (!streams.length) {
// //     return (
// //       <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white gap-4">
// //         No streams found for this creator.
// //       </div>
// //     );
// //   }

// //   const currentStream = streams.find((s) => s.id === currentStreamId);
// //   const queue = streams
// //     .filter((s) => s.id !== currentStreamId)
// //     .sort((a, b) => b.upvotes - a.upvotes);

// //   return (
// //     <div className="min-h-screen bg-gray-900 text-white p-6">
// //       <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
// //         🎵 Stream Queue
// //       </h1>

// //       {/* Add Stream */}
// //       <div className="max-w-4xl mx-auto flex gap-2 mb-6">
// //         <input
// //           type="text"
// //           value={newStreamId}
// //           onChange={(e) => setNewStreamId(e.target.value)}
// //           placeholder="Enter YouTube Stream ID"
// //           className="flex-1 p-2 rounded-md bg-gray-800 text-white outline-none"
// //         />
// //         <button
// //           onClick={handleAddStream}
// //           disabled={adding}
// //           className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:bg-gray-600"
// //         >
// //           {adding ? "Adding..." : "Add Stream"}
// //         </button>
// //       </div>

// //       {/* Player */}
// //       <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
// //         <div id="yt-player" className="w-full h-full"></div>
// //       </div>

// //       {/* Queue */}
// //       <div className="space-y-4 max-w-3xl mx-auto">
// //         {queue.map((stream) => (
// //           <div
// //             key={stream.id}
// //             className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
// //           >
// //             <img
// //               src={
// //                 stream.thumbnail?.url ||
// //                 `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`
// //               }
// //               alt={stream.title || "Untitled Stream"}
// //               className="w-28 h-16 object-cover rounded-md cursor-pointer"
// //               onClick={() => setCurrentStreamId(stream.id)}
// //             />
// //             <p className="flex-1 text-lg">{stream.title || "Untitled Stream"}</p>
// //             <button
// //               onClick={() => handleToggleUpvote(stream.id)}
// //               className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
// //                 stream.hasUpvoted
// //                   ? "bg-green-700 hover:bg-green-800"
// //                   : "bg-green-600 hover:bg-green-700"
// //               }`}
// //             >
// //               👍 {stream.upvotes ?? 0}
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams } from "next/navigation";

// export const dynamic = "force-dynamic";

// type Stream = {
//   id: string;
//   extracedId: string;
//   title?: string;
//   thumbnail?: { url: string };
//   upvotes: number;
//   hasUpvoted?: boolean;
// };

// declare global {
//   interface Window {
//     YT: any;
//     onYouTubeIframeAPIReady: () => void;
//   }
// }

// export default function StreamsPage() {
//   const params = useSearchParams();
//   const creatorId = params.get("creatorId");
//   const [streams, setStreams] = useState<Stream[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [newStreamId, setNewStreamId] = useState("");
//   const [adding, setAdding] = useState(false);
//   const [playerReady, setPlayerReady] = useState(false);
//   const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

//   const playerRef = useRef<any>(null);

//   // Fetch streams
//   useEffect(() => {
//     if (!creatorId) return;

//     const fetchStreams = async () => {
//       try {
//         const res = await fetch(`/api/streams?creatorId=${creatorId}`);
//         const data = await res.json();

//         if (res.ok && data.streams) {
//           const validStreams: Stream[] = data.streams.filter(
//             (s: any) => s?.id && s?.extracedId
//           );

//           validStreams.sort((a, b) => b.upvotes - a.upvotes);
//           setStreams(validStreams);
//           if (!currentStreamId && validStreams.length > 0) {
//             setCurrentStreamId(validStreams[0].id);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching streams:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStreams();
//   }, [creatorId]);

//   // Initialize YouTube Player
//   useEffect(() => {
//     if (!streams.length || !currentStreamId) return;

//     const loadYouTubeAPI = () => {
//       if (window.YT && window.YT.Player) {
//         initPlayer();
//       } else {
//         const scriptTag = document.createElement("script");
//         scriptTag.src = "https://www.youtube.com/iframe_api";
//         document.body.appendChild(scriptTag);
//         window.onYouTubeIframeAPIReady = initPlayer;
//       }
//     };

//     const initPlayer = () => {
//       const currentStream = streams.find((s) => s.id === currentStreamId);
//       if (!currentStream) return;

//       if (!playerRef.current) {
//         playerRef.current = new window.YT.Player("yt-player", {
//           videoId: currentStream.extracedId,
//           events: {
//             onReady: () => setPlayerReady(true),
//             onStateChange: (event: any) => {
//               if (event.data === window.YT.PlayerState.ENDED) playNextStream();
//             },
//           },
//         });
//       } else if (playerReady && typeof playerRef.current.loadVideoById === "function") {
//         playerRef.current.loadVideoById(currentStream.extracedId);
//       }
//     };

//     loadYouTubeAPI();
//   }, [currentStreamId, streams]);

//   // Play next stream by upvotes
//   const playNextStream = () => {
//     setStreams((prev) => {
//       const sorted = [...prev].sort((a, b) => b.upvotes - a.upvotes);
//       const currentIndex = sorted.findIndex((s) => s.id === currentStreamId);
//       const next = sorted[currentIndex + 1] || sorted[0];
//       if (next && next.id !== currentStreamId) {
//         setCurrentStreamId(next.id);
//       }
//       return sorted;
//     });
//   };

//   // Upvote / remove upvote
//   const handleToggleUpvote = async (streamId: string) => {
//     try {
//       const res = await fetch(`/api/streams/upvotes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           streamId,
//           action:
//             streams.find((s) => s.id === streamId)?.hasUpvoted ? "remove" : "upvote",
//         }),
//       });
//       const data = await res.json();

//       setStreams((prev) => {
//         const updated = prev.map((s) =>
//           s.id === streamId
//             ? { ...s, upvotes: data.upvotes ?? s.upvotes, hasUpvoted: !s.hasUpvoted }
//             : s
//         );
//         return updated.sort((a, b) => b.upvotes - a.upvotes);
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add new stream
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
//         setStreams((prev) => [...prev, data.stream].sort((a, b) => b.upvotes - a.upvotes));
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

//   const currentStream = streams.find((s) => s.id === currentStreamId);
//   const queue = streams.filter((s) => s.id !== currentStreamId).sort((a, b) => b.upvotes - a.upvotes);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">🎵 Stream Queue</h1>

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

//       <div className="mb-6 aspect-video rounded-lg overflow-hidden max-w-4xl mx-auto">
//         <div id="yt-player" className="w-full h-full"></div>
//       </div>

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {queue.map((stream) => (
//           <div
//             key={stream.id}
//             className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center gap-4"
//           >
//             <img
//               src={stream.thumbnail?.url || `https://img.youtube.com/vi/${stream.extracedId}/hqdefault.jpg`}
//               alt={stream.title || "Untitled Stream"}
//               className="w-28 h-16 object-cover rounded-md cursor-pointer"
//               onClick={() => setCurrentStreamId(stream.id)}
//             />
//             <p className="flex-1 text-lg">{stream.title || "Untitled Stream"}</p>
//             <button
//               onClick={() => handleToggleUpvote(stream.id)}
//               className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
//                 stream.hasUpvoted ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               👍 {stream.upvotes ?? 0}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";
import dynamic from "next/dynamic";

// Dynamically import the client page, SSR disabled
const StreamsPage = dynamic(() => import("./StreamsPage"), { ssr: false });

export default function Page() {
  return <StreamsPage />;
}

