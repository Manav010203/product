"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserData = {
  id: string;
  email: string;
};

export default function CreatorPage() {
  const { data: session, status } = useSession();
  const [songUrl, setSongUrl] = useState("");
  const [creatorCode, setCreatorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🌀 Loading UI
  if (status === "loading" || loading) {
    return (
      <div className="bg-white dark:bg-gray-800 flex justify-center items-center w-screen h-screen p-5">
        <div className="text-center p-6">
          <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-[#714F04] mx-auto"></div>
          <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your adventure is about to begin
          </p>
        </div>
      </div>
    );
  }

  // 🚫 Not signed in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Please sign in to create your stream page.</p>
      </div>
    );
  }

  // 🧠 Handle stream creation
  const handleSubmit = async () => {
    if (!songUrl.trim()) return alert("Please enter a song URL");

    setLoading(true);
    try {
      // ✅ Fetch user data (you already have session but this ensures DB user exists)
      const userRes = await fetch("/api/users");
      const userData: UserData = await userRes.json();

      if (!userRes.ok || !userData.id) {
        throw new Error("Unable to find user ID");
      }

      // ✅ Create stream
      const res = await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId: userData.id, url: songUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ You didn’t return `creatorCode` from backend — use `id` instead
        setCreatorCode(userData.id);
        router.push(`/streams?creatorId=${userData.id}`);
      } else {
        alert(data.message || "Failed to create stream page");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating stream page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        🎵 Create Your Stream Page
      </h1>

      {/* Input Box */}
      <div className="flex gap-2 max-w-md w-full mb-6">
        <input
          type="text"
          value={songUrl}
          onChange={(e) => setSongUrl(e.target.value)}
          placeholder="Enter a YouTube URL"
          className="flex-1 p-2 rounded-md bg-gray-800 text-white outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:bg-gray-600"
        >
          {loading ? "Creating..." : "Create Page"}
        </button>
      </div>

      {/* ✅ Creator Code Display */}
      {creatorCode && (
        <div className="bg-gray-800 p-4 rounded-md text-center max-w-md w-full">
          <p className="mb-2">Your stream page is ready! Share this code:</p>
          <p className="text-blue-400 font-bold text-lg">{creatorCode}</p>
        </div>
      )}
    </div>
  );
}
