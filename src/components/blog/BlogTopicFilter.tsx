import { useTranslation } from "react-i18next";
import type { BlogTopic } from "@/types/blog";

interface BlogTopicFilterProps {
  activeTopic: BlogTopic | undefined;
  onFilterChange: (topic: BlogTopic | undefined) => void;
}

const TOPICS: (BlogTopic | 'all')[] = ['all', 'ai', 'nocode', 'lovable', 'webdev', 'technology'];

const BlogTopicFilter = ({ activeTopic, onFilterChange }: BlogTopicFilterProps) => {
  const { t } = useTranslation();

  const getLabel = (topic: BlogTopic | 'all') => {
    return t(`blog.filters.${topic}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {TOPICS.map((topic) => (
        <button
          key={topic}
          onClick={() => onFilterChange(topic === 'all' ? undefined : topic)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            (topic === 'all' && !activeTopic) || activeTopic === topic
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {getLabel(topic)}
        </button>
      ))}
    </div>
  );
};

export default BlogTopicFilter;
