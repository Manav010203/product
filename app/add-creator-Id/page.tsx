"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddCreatorId() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [creatorId, setCreatorId] = useState("");
  const router = useRouter()

  const handleSubmit = async () => {
    if (!creatorId.trim()) {
      return alert("Please enter the creator ID");
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/streams?creatorId=${creatorId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Response:", data);
       if (res.ok && data.streams?.length > 0) {
        // ✅ Redirect to /streams page with creatorId
        router.push(`/streams?creatorId=${creatorId}`);
      } else {
        alert("No streams found for this creator.");
      }
    } catch (e) {
      console.error("Error fetching streams:", e);
      alert("Failed to fetch streams.");
    } finally {
      setLoading(false);
    }
};

  // 🔄 Show loading animation
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

  // 🚫 If not signed in
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Please sign in to add a creator ID.</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center">
      <div className="flex items-center bg-gray-900 p-4 rounded-md max-w-xl w-full mx-4">
        <span className="text-green-500 text-xl">&gt;</span>
        <input
          type="text"
          value={creatorId}
          onChange={(e) => setCreatorId(e.target.value)}
          className="bg-gray-900 text-white p-1 outline-none ml-2 w-full"
          placeholder="Type the Creator Code You want the streams for"
        />
        <button
          onClick={handleSubmit} // ✅ missing in your version
          disabled={loading}
          className="ml-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-1.5 px-4 rounded-md transition-colors duration-200"
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
