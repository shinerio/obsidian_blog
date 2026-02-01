/**
 * 搜索引擎
 * Search Engine for building search index and providing search functionality
 * Enhanced to support weighted scoring: title matches (weight 3), tag matches (weight 2), content matches (weight 1)
 */
import { SearchIndex, SearchResult, ParsedArticle } from '../types';
export declare class SearchEngine {
    private articleMap;
    /**
     * 构建搜索索引
     * Build search index from articles
     */
    buildIndex(articles: ParsedArticle[]): SearchIndex;
    /**
     * 搜索文章
     * Search articles by query
     */
    search(query: string, searchIndex: SearchIndex): SearchResult[];
    /**
     * 生成搜索数据JSON
     * Generate search data for client-side search
     */
    generateSearchData(searchIndex: SearchIndex): string;
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
     * 生成文章ID
     * Generate article ID
     */
    private generateId;
    /**
     * 创建URL友好的slug
     * Create URL-friendly slug
     */
    private createSlug;
    /**
     * 计算字数
     * Calculate word count
     */
    private calculateWordCount;
}
//# sourceMappingURL=SearchEngine.d.ts.map