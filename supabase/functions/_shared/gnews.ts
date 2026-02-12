const GNEWS_API_URL = 'https://gnews.io/api/v4/search';

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

const TOPIC_QUERIES: Record<string, string> = {
  ai: 'artificial intelligence OR machine learning OR AI tools',
  nocode: 'no-code tools OR low-code platform OR nocode',
  lovable: 'Lovable AI OR AI web development OR AI app builder',
  webdev: 'web development trends OR frontend framework OR web design',
  technology: 'technology startups OR tech innovation OR SaaS',
};

export async function fetchNewsForTopic(
  apiKey: string,
  topic: string,
  maxResults: number = 5
): Promise<GNewsArticle[]> {
  const query = TOPIC_QUERIES[topic] || topic;
  const params = new URLSearchParams({
    q: query,
    token: apiKey,
    lang: 'en',
    max: maxResults.toString(),
    sortby: 'publishedAt',
  });

  const response = await fetch(`${GNEWS_API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`GNews API error: ${response.status} ${response.statusText}`);
  }

  const data: GNewsResponse = await response.json();
  return data.articles || [];
}

export async function fetchBestArticleForTopic(
  apiKey: string,
  topic: string
): Promise<GNewsArticle | null> {
  const articles = await fetchNewsForTopic(apiKey, topic, 3);
  if (articles.length === 0) return null;

  // Return the most recent article with content
  return articles.find(a => a.content && a.content.length > 100) || articles[0];
}
