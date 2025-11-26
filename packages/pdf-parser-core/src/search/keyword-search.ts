/**
 * 关键词搜索引擎
 */

import type { SearchOptions, SearchResult } from '../types/index.js';

export class SearchEngine {
  /**
   * 搜索关键词
   */
  search(text: string, query: string, options?: SearchOptions): SearchResult[] {
    const caseSensitive = options?.caseSensitive ?? false;
    const maxResults = options?.maxResults ?? 10;
    const contextLength = options?.contextLength ?? 50;

    const searchText = caseSensitive ? text : text.toLowerCase();
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    const results: SearchResult[] = [];
    let position = 0;

    while (position < searchText.length && results.length < maxResults) {
      position = searchText.indexOf(searchQuery, position);

      if (position === -1) break;

      // 计算上下文
      const contextStart = Math.max(0, position - contextLength);
      const contextEnd = Math.min(text.length, position + query.length + contextLength);
      const context = text.substring(contextStart, contextEnd);

      // 提取匹配片段
      const snippet = text.substring(position, position + query.length);

      // 估算页码（简化实现）
      const page = Math.floor(position / 2000) + 1;

      results.push({
        page,
        snippet,
        context,
        position,
      });

      position += query.length;
    }

    return results;
  }
}
