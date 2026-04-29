import Parser from 'rss-parser';

const FEED_URL = 'https://urbanfuturesnow.substack.com/feed';

export interface SubstackPost {
  title: string;
  slug: string;
  url: string;
  date: string;
  excerpt: string;
  content: string;
}

function extractSlug(url: string): string {
  // Extract slug from https://urbanfuturesnow.substack.com/p/some-slug
  const match = url.match(/\/p\/([^/?#]+)/);
  return match ? match[1] : encodeURIComponent(url);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return dateStr;
  }
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'contentEncoded']],
    },
  });

  const feed = await parser.parseURL(FEED_URL);

  return (feed.items ?? []).map((item: any) => {
    const url = item.link ?? '';
    const rawExcerpt = item.contentSnippet ?? item.summary ?? stripHtml(item.contentEncoded ?? '');
    const excerpt = rawExcerpt.slice(0, 200).trim() + (rawExcerpt.length > 200 ? '…' : '');

    return {
      title: item.title ?? 'Untitled',
      slug: extractSlug(url),
      url,
      date: formatDate(item.pubDate ?? item.isoDate ?? ''),
      excerpt,
      content: item.contentEncoded ?? '',
    };
  });
}
