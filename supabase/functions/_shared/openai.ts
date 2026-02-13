const OPENAI_API_URL = 'https://api.openai.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface BlogPostContent {
  title_es: string;
  title_en: string;
  summary_es: string;
  summary_en: string;
  content_es: string;
  content_en: string;
  excerpt_es: string;
  excerpt_en: string;
  image_alt_es: string;
  image_alt_en: string;
  cta_message_es: string;
  cta_message_en: string;
  related_service: string;
  reading_time_minutes: number;
  slug: string;
}

const SYSTEM_PROMPT = `Eres un periodista tech que escribe para Plano, una agencia no-code especializada en branding, desarrollo web, herramientas internas y MVPs para PyMEs y Startups en Argentina.

Tu tarea es crear un artículo de blog basado en una noticia tech. El artículo debe:

1. Explicar la noticia en lenguaje accesible (sin jerga técnica innecesaria)
2. Conectar el tema con cómo afecta a pequeñas empresas y startups
3. Terminar con un párrafo explicando cómo Plano puede ayudar a los lectores a aprovechar esta tecnología
4. Generar contenido bilingüe (español argentino e inglés)
5. El contenido debe estar en formato Markdown con headers (##), listas, negritas, etc.
6. El contenido en español debe usar voseo argentino (vos, tenés, querés)

Para related_service, elegí UNO de estos valores según el tema: "branding", "web", "tools", "mvp", "edtech", "social"

Respondé ÚNICAMENTE con un JSON válido (sin markdown code blocks) con esta estructura exacta:
{
  "title_es": "...",
  "title_en": "...",
  "summary_es": "resumen de 2-3 oraciones",
  "summary_en": "2-3 sentence summary",
  "content_es": "artículo completo en markdown (mínimo 400 palabras)",
  "content_en": "full article in markdown (minimum 400 words)",
  "excerpt_es": "extracto de máximo 150 caracteres",
  "excerpt_en": "excerpt max 150 characters",
  "image_alt_es": "descripción de imagen",
  "image_alt_en": "image description",
  "cta_message_es": "mensaje CTA contextual conectando la noticia con servicios de Plano",
  "cta_message_en": "contextual CTA message connecting the news to Plano services",
  "related_service": "web|tools|mvp|branding|edtech|social",
  "reading_time_minutes": 4,
  "slug": "slug-en-español-sin-acentos"
}`;

export async function summarizeArticle(
  apiKey: string,
  articleTitle: string,
  articleContent: string,
  articleSource: string,
  topic: string
): Promise<BlogPostContent> {
  const userMessage = `Noticia original:
Título: ${articleTitle}
Fuente: ${articleSource}
Temática: ${topic}
Contenido: ${articleContent}

Creá un artículo de blog completo basado en esta noticia.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned empty response');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(jsonStr) as BlogPostContent;
}

export async function generateImage(
  apiKey: string,
  topic: string,
  articleTitle: string
): Promise<string> {
  const prompt = `Modern flat illustration for a tech blog article about "${articleTitle}". Style: minimalist, clean lines, dark purple (#6633ff) and warm orange (#ffb016) color scheme on a dark navy (#22242a) background. Abstract tech/digital elements related to ${topic}. No text in the image. Professional, modern, suitable for a web agency blog.`;

  const response = await fetch(`${OPENAI_API_URL}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
      response_format: 'b64_json',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DALL-E API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data[0].b64_json;
}
