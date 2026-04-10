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
      {TOPICS.map((topic) => {
        const isActive = (topic === 'all' && !activeTopic) || activeTopic === topic;
        return (
          <button
            key={topic}
            onClick={() => onFilterChange(topic === 'all' ? undefined : topic)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                : "bg-transparent text-foreground border-border hover:border-primary/50 hover:text-primary"
            }`}
          >
            {getLabel(topic)}
          </button>
        );
      })}
    </div>
  );
};

export default BlogTopicFilter;
