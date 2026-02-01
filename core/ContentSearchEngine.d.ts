/**
 * 内容搜索引擎
 * Content Search Engine for building content-specific search index and providing content search functionality
 */
import { SearchableArticle, SearchResult, ParsedArticle } from '../types';
export declare class ContentSearchEngine {
    private articleMap;
    /**
     * 构建内容搜索索引
     * Build content-specific search index from articles
     */
    buildIndex(articles: ParsedArticle[]): Map<string, Array<{
        articleIndex: number;
        weight: number;
    }>>;
    /**
     * 在内容中搜索文章
     * Search articles by query in content only
     */
    search(query: string, searchIndex: Map<string, Array<{
        articleIndex: number;
        weight: number;
    }>>, searchableArticles: SearchableArticle[]): SearchResult[];
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
//# sourceMappingURL=ContentSearchEngine.d.ts.map