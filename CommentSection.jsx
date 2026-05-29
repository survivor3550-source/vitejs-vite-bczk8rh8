import React from 'react';
import { useComments } from './useComments';

const CommentSection = ({ postId }) => {
  const { comments } = useComments(postId);

  return (
    <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
      {comments.map((comment) => {
        return (
          <div key={comment.id} className="flex items-start py-2.5 px-3 hover:bg-white/5 transition-all duration-200 rounded-xl group cursor-default">
            <div className="text-[13px] sm:text-sm">
              <span className="font-semibold text-white mr-2">{comment.authorName}</span>
              <p className="inline text-zinc-400 leading-relaxed antialiased">{comment.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentSection;