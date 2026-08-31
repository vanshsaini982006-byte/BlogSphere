import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import { getPost } from "../services/postService";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Loader2 } from "lucide-react";

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPost(id);
        if (data.post.author._id !== user._id) {
          showToast("You can only edit your own posts", "error");
          navigate("/dashboard");
          return;
        }
        setPost(data.post);
      } catch {
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-spine-600" size={28} />
      </div>
    );
  }

  return <PostEditor initialPost={post} />;
};

export default EditPost;
