/**
 * 网站生成器
 * Site Generator for creating HTML pages and static assets
 */
import { GenerationOptions, Article } from '../types';
export declare class SiteGenerator {
    private templateCache;
    /**
     * 生成网站
     * Generate complete website
     */
    generateSite(options: GenerationOptions): Promise<void>;
    /**
     * 生成首页
     * Generate home page
     */
    generateHomePage(articles: Article[], options: GenerationOptions): Promise<void>;
    /**
     * 生成文章列表页
     * Generate article list page
     */
    generateArticleList(articles: Article[], options: GenerationOptions): Promise<void>;
    /**
     * 生成搜索页面
     * Generate search page
     */
    generateSearchPage(options: GenerationOptions): Promise<void>;
    generateArticlePages(articles: Article[], options: GenerationOptions): Promise<void>;
    /**
     * 复制静态资源
     * Copy static assets
     */
    copyStaticAssets(outputPath: string): Promise<void>;
    /**
     * 转换为完整的文章数据结构
     * Convert parsed articles to full article data structure
     */
    private convertToArticles;
    /**
     * 加载模板文件
     * Load template file
     */
    private loadTemplate;
    /**
     * 渲染模板
     * Render template with data
     */
    private renderTemplate;
    /**
     * 转换Markdown为HTML
     * Convert markdown to HTML
     */
    private convertMarkdownToHtml;
    /**
     * 处理Obsidian内部链接
     * Process Obsidian internal links
     */
    private processObsidianLinks;
    /**
     * 生成目录
     * Generate table of contents
     */
    private generateTableOfContents;
    /**
     * 获取相关文章
     * Get related articles based on tags
     */
    private getRelatedArticles;
    /**
     * 获取热门标签
     * Get popular tags
     */
    private getPopularTags;
    /**
     * 渲染文章卡片
     * Render article card for home page
     */
    private renderArticleCard;
    /**
     * 渲染文章列表项
     * Render article list item
     */
    private renderArticleListItem;
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
     * 从内容中提取描述
     * Extract description from content
     */
    private extractDescription;
    /**
     * 格式化日期
     * Format date for display
     */
    private formatDate;
}
//# sourceMappingURL=SiteGenerator.d.ts.map