import { Helmet } from "react-helmet-async";

interface BlogSEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const BlogSEO = ({ title, description, image, url, type = "website" }: BlogSEOProps) => {
  const fullTitle = `${title} | Plano`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
};

export default BlogSEO;
