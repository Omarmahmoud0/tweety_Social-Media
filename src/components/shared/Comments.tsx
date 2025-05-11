import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useComment } from "@/lib/react-query/queriesAndMutations";
import { IUser } from "@/types";

type PostCardProps = {
  postId: string;
  user: IUser;
};

const Comments = ({ postId, user }: PostCardProps) => {
  const { mutateAsync: createComment } = useComment();
  const [input, setInput] = useState("");

  const handleAddComment = async () => {
    if (input.trim() === "" || input.trim() === null) {
      return toast({ title: "An empty comment cannot be shared" });
    } else {
      try {
        const Comment = await createComment({
          comment: {
            userId: user.id,
            postId: postId,
            title: input,
            imageUrl: user.imageUrl,
            name: user.name,
          },
        });
        if (Comment) {
          toast({ title: "Comment posted" });
        }
        if (!Comment) throw Error;
        setInput("");
        return Comment;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex gap-3 mt-9">
      <img
        src={user.imageUrl}
        alt=""
        width={35}
        height={35}
        className="rounded-full object-cover"
      />
      <div className="flex items-center justify-between w-full bg-indigo-950 rounded-lg px-3 py-2">
        <input
          type="text"
          className="w-11/12 bg-transparent border-none outline-none text-sm"
          placeholder="Write your comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <img
          className="cursor-pointer"
          src="/assets/icons/send.svg"
          alt="send"
          width={18}
          height={18}
          onClick={handleAddComment}
        />
      </div>
    </div>
  );
};

export default Comments;
