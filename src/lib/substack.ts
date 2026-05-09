import Parser from 'rss-parser';

const FEED_URL = 'https://urbanfuturesnow.substack.com/feed';

export interface SubstackPost {
  title: string;
  slug: string;
  url: string;
  date: string;
  fullDate: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
}

function extractSlug(url: string): string {
  const match = url.match(/\/p\/([^/?#]+)/);
  return match ? match[1] : encodeURIComponent(url);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function formatYear(dateStr: string): string {
  try {
    return new Date(dateStr).getFullYear().toString();
  } catch {
    return dateStr;
  }
}

function formatFullDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/** Pull the first usable image src from an RSS item */
function extractImage(item: any): string | undefined {
  // 1. Standard RSS enclosure (most reliable)
  if (item.enclosure?.url) return item.enclosure.url;

  // 2. media:content tag
  const media = item['media:content'] ?? item['media:thumbnail'];
  if (media?.$.url) return media.$.url;
  if (typeof media === 'string' && media.startsWith('http')) return media;

  // 3. First <img src> inside the HTML content
  const html = item.contentEncoded ?? item['content:encoded'] ?? '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];

  return undefined;
}

/** Map a Substack category slug/name to a short display label */
function extractCategory(item: any): string {
  const cats: string[] = item.categories ?? [];
  if (cats.length > 0) return cats[0];
  // Derive from content keywords as a fallback
  const text = (item.title ?? '' + item.contentSnippet ?? '').toLowerCase();
  if (text.includes('housing') || text.includes('lilac')) return 'Housing';
  if (text.includes('climate') || text.includes('carbon')) return 'Climate';
  if (text.includes('city') || text.includes('urban')) return 'Urban';
  return 'Essay';
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['content:encoded', 'contentEncoded'],
        ['media:content', 'media:content'],
        ['media:thumbnail', 'media:thumbnail'],
        ['enclosure', 'enclosure'],
      ],
    },
  });

  const feed = await parser.parseURL(FEED_URL);

  return (feed.items ?? []).map((item: any) => {
    const url = item.link ?? '';
    const rawExcerpt = item.contentSnippet ?? item.summary ?? stripHtml(item.contentEncoded ?? '');
    const excerpt = rawExcerpt.slice(0, 200).trim() + (rawExcerpt.length > 200 ? '…' : '');
    const pubDate = item.pubDate ?? item.isoDate ?? '';

    return {
      title:    item.title ?? 'Untitled',
      slug:     extractSlug(url),
      url,
      date:     formatYear(pubDate),
      fullDate: formatFullDate(pubDate),
      excerpt,
      content:  item.contentEncoded ?? '',
      image:    extractImage(item),
      category: extractCategory(item),
    };
  });
}
