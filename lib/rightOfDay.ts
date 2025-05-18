// Utility to select the "Right of the Day" from a list of articles, rotating by date.
// Assumes articles is a non-empty array of article objects (from Chapter 4).

export interface Article {
  article_number: number;
  article_title: string;
  clauses: Array<{
    clause_number: string;
    content: string;
    sub_clauses: Array<{
      sub_clause_id: string;
      content: string;
    }>;
  }>;
}

/**
 * Returns the article for the current day, rotating through the list by date.
 * @param articles Array of articles (rights) from Chapter 4
 * @param date (optional) Date object; defaults to today (UTC)
 * @param startDate (optional) Start date for rotation (defaults to 2010-08-27, the promulgation date)
 */
export function getRightOfTheDay(
  articles: Article[],
  date: Date = new Date(),
  startDate: Date = new Date(Date.UTC(2010, 7, 27)) // August is 7 (0-based)
): Article {
  if (!articles || articles.length === 0) throw new Error("No articles provided");

  // Always use UTC for consistency
  const todayUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const startUTC = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
  const daysSinceStart = Math.floor((todayUTC - startUTC) / (1000 * 60 * 60 * 24));

  // Positive modulo for cycling
  const idx = ((daysSinceStart % articles.length) + articles.length) % articles.length;
  return articles[idx];
}
