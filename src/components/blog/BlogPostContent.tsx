import Markdown from "react-markdown";

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent = ({ content }: BlogPostContentProps) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground prose-img:rounded-xl">
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default BlogPostContent;
