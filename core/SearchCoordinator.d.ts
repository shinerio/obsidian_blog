/**
 * 搜索协调器
 * Search Coordinator for managing both TitleSearchEngine and ContentSearchEngine
 * Maintains backward compatibility with the original SearchEngine interface
 */
import { SearchIndex, SearchResult, ParsedArticle } from '../types';
export declare class SearchCoordinator {
    private titleSearchEngine;
    private contentSearchEngine;
    private articleMap;
    constructor();
    /**
     * 构建搜索索引
     * Build search index from articles using both title and content search engines
     */
    buildIndex(articles: ParsedArticle[]): SearchIndex;
    /**
     * 搜索文章
     * Search articles by query using both title and content search engines
     */
    search(query: string, searchIndex: SearchIndex): SearchResult[];
    /**
     * 生成搜索数据JSON
     * Generate search data for client-side search
     */
    generateSearchData(searchIndex: SearchIndex): string;
    /**
     * 生成搜索结果高亮
     * Generate highlights for search results
     */
    private generateHighlights;
    /**
     * 在文本中查找匹配项
     * Find matches in text and return highlighted snippets
     */
    private findMatchesInText;
    /**
     * 转义正则表达式特殊字符
     * Escape regex special characters
     */
    private escapeRegex;
    /**
     * 提取可搜索的内容
     * Extract searchable content from markdown
     */
    private extractSearchableContent;
    /**
     * 提取搜索词
     * Extract words for indexing
     */
    private extractWords;
    /**
     * 生成文章ID
     * Generate article ID
     */
    private generateId;
    /**
     * 创建URL友好的slug
     * Create URL-friendly slug
     */
    private createSlug;
}
//# sourceMappingURL=SearchCoordinator.d.ts.map