import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination = ({ currentPage, totalPages, onPageChange }: BlogPaginationProps) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t('blog.pagination.previous')}
      </Button>

      <span className="text-sm text-muted-foreground">
        {t('blog.pagination.page', { current: currentPage, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        {t('blog.pagination.next')}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default BlogPagination;
