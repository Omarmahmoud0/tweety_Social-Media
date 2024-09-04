import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import {
  useComment,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutations";
import { ICommentUser } from "@/types";

type PostCardProps = {
  postId: string;
};

const Comments = ({ postId }: PostCardProps) => {
  const { user } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();
  const { mutateAsync: createComment } = useComment();

  const [input, setInput] = useState("");

  const [comment, setComment] = useState<ICommentUser>();

  const handle = async () => {
      if (input.trim() === "" || input.trim() === null) {
        return toast({ title: "An empty comment cannot be shared" });
      }
      const Comment = await createComment({
        ...comment,
        name: currentUser?.name,
        imageUrl: currentUser?.imageUrl,
        id: user.id,
        title: input,
        postId: postId,
      });

      if (!Comment) throw Error;
      setInput("");
      setComment({} as ICommentUser);
      return Comment;
  };

  return (
    <div className="flex gap-3 mt-9">
      <img
        src={user.imageUrl}
        alt=""
        width={35}
        height={35}
        className="rounded-full"
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
          onClick={handle}
        />
      </div>
    </div>
  );
};

export default Comments;
