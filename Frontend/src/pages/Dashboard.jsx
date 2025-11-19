import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const res = await axios.get("http://localhost:8000/posts/feed");
        setPosts(res.data);
      } catch (err) {
        console.log("Error loading feed:", err);
      }
    };

    loadFeed();
  }, []);

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold">Feed</h1>

      <div className="mt-6 flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white/20 p-4 rounded-xl backdrop-blur-md">
            <p>{post.content}</p>
            <p className="text-sm text-gray-300 mt-2">{post.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
