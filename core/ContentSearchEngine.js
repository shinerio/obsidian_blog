"use strict";
/**
 * 内容搜索引擎
 * Content Search Engine for building content-specific search index and providing content search functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentSearchEngine = void 0;
class ContentSearchEngine {
    constructor() {
        // 存储原始文章数据的映射，用于搜索结果
        this.articleMap = new Map();
    }
    /**
     * 构建内容搜索索引
     * Build content-specific search index from articles
     */
    buildIndex(articles) {
        // 清空之前的映射
        this.articleMap.clear();
        const searchableArticles = articles
            .filter(article => !article.metadata.draft)
            .map((article, index) => {
            const id = this.generateId(article.filePath);
            const slug = article.metadata.slug || this.createSlug(article.metadata.title);
            // 存储原始文章数据
            this.articleMap.set(id, article);
            return {
                id,
                title: article.metadata.title,
                content: this.extractSearchableContent(article.content),
                tags: article.metadata.tags,
                slug
            };
        });
        // 创建内容索引：内容权重为1
        const contentIndex = new Map();
        // 为每篇文章建立内容索引
        searchableArticles.forEach((article, articleIndex) => {
            // 内容索引（权重为1）
            const contentWords = this.extractWords(article.content);
            contentWords.forEach(word => {
                if (!contentIndex.has(word)) {
                    contentIndex.set(word, []);
                }
                const articleIndices = contentIndex.get(word);
                if (!articleIndices.includes(articleIndex)) {
                    articleIndices.push(articleIndex);
                }
            });
        });
        // 创建内容专用索引结构，所有条目都使用权重1
        const index = new Map();
        contentIndex.forEach((articleIndices, word) => {
            if (!index.has(word)) {
                index.set(word, []);
            }
            const wordData = index.get(word);
            articleIndices.forEach(articleIndex => {
                wordData.push({ articleIndex, weight: 1 }); // 内容权重为1
            });
        });
        return index;
    }
    /**
     * 在内容中搜索文章
     * Search articles by query in content only
     */
    search(query, searchIndex, searchableArticles) {
        if (!query.trim()) {
            return [];
        }
        const queryWords = this.extractWords(query);
        const articleScores = new Map();
        // 计算每篇文章的相关性分数
        queryWords.forEach(word => {
            const articleWeightData = searchIndex.get(word) || [];
            articleWeightData.forEach(data => {
                const current = articleScores.get(data.articleIndex) || {
                    score: 0,
                    matchedWords: [],
                    matchLocations: { inTitle: false, inContent: false, inTags: false }
                };
                current.score += data.weight; // 使用权重计算分数
                if (!current.matchedWords.includes(word)) {
                    current.matchedWords.push(word);
                }
                // 内容搜索结果始终标记为内容匹配
                current.matchLocations.inContent = true;
                articleScores.set(data.articleIndex, current);
            });
        });
        // 转换为搜索结果并排序
        const results = [];
        articleScores.forEach((scoreData, articleIndex) => {
            const searchableArticle = searchableArticles[articleIndex];
            if (searchableArticle) {
                // 从映射中获取原始文章数据
                const originalArticle = this.articleMap.get(searchableArticle.id);
                if (originalArticle) {
                    results.push({
                        article: originalArticle,
                        score: scoreData.score,
                        highlights: this.generateHighlights(searchableArticle, scoreData.matchedWords),
                        matchLocations: scoreData.matchLocations
                    });
                }
            }
        });
        // 按分数降序排序
        return results.sort((a, b) => b.score - a.score);
    }
    /**
     * 生成搜索结果高亮
     * Generate highlights for search results
     */
    generateHighlights(article, queryWords) {
        const highlights = [];
        queryWords.forEach(word => {
            // 在内容中查找匹配
            const contentMatches = this.findMatchesInText(article.content, word, 50);
            // 添加内容匹配
            contentMatches.forEach(match => {
                highlights.push(`<em>[CONTENT]</em> ${match}`);
            });
        });
        // 去重并限制数量
        return [...new Set(highlights)].slice(0, 3);
    }
    /**
     * 在文本中查找匹配项
     * Find matches in text and return highlighted snippets
     */
    findMatchesInText(text, word, contextLength) {
        const matches = [];
        // 为中文和英文分别处理高亮
        const chineseRegex = new RegExp(`(.{0,${contextLength}})(${this.escapeRegex(word)})(.{0,${contextLength}})`, 'gi');
        const englishRegex = new RegExp(`(.{0,${contextLength}})\\b(${this.escapeRegex(word)})\\b(.{0,${contextLength}})`, 'gi');
        let matchResults = text.match(chineseRegex);
        if (!matchResults) {
            matchResults = text.match(englishRegex);
        }
        if (matchResults) {
            // 取前几个匹配项，并添加高亮标记
            const limitedMatches = matchResults.slice(0, 2);
            limitedMatches.forEach(match => {
                matches.push(match.replace(new RegExp(`(${this.escapeRegex(word)})`, 'gi'), '<mark>$1</mark>'));
            });
        }
        return matches;
    }
    /**
     * 转义正则表达式特殊字符
     * Escape regex special characters
     */
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * 提取可搜索的内容
     * Extract searchable content from markdown
     */
    extractSearchableContent(content) {
        return content
            .replace(/```[\s\S]*?```/g, '') // 移除代码块
            .replace(/`[^`]+`/g, '') // 移除行内代码
            .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
            .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/[#*_~`]/g, '') // 移除markdown符号
            .replace(/\s+/g, ' ') // 合并空格
            .trim();
    }
    /**
     * 提取搜索词
     * Extract words for indexing
     */
    extractWords(text) {
        const words = [];
        // 提取中文字符（单个字符作为词）
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        words.push(...chineseChars);
        // 提取英文单词和数字
        const englishWords = text
            .replace(/[\u4e00-\u9fa5]/g, ' ') // 将中文字符替换为空格
            .toLowerCase()
            .match(/[a-z0-9]+/g) || [];
        words.push(...englishWords);
        // 去重并过滤短词和常见停用词
        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']);
        return [...new Set(words)]
            .filter(word => word.length > 1 && !stopWords.has(word.toLowerCase()));
    }
    /**
     * 生成文章ID
     * Generate article ID
     */
    generateId(filePath) {
        return filePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    }
    /**
     * 创建URL友好的slug
     * Create URL-friendly slug
     */
    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
exports.ContentSearchEngine = ContentSearchEngine;
//# sourceMappingURL=ContentSearchEngine.js.map