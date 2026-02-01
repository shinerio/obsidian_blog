/**
 * 元数据解析器
 * Metadata Parser for extracting frontmatter and processing markdown content
 */
import { ArticleMetadata, ParsedArticle } from '../types';
export declare class MetadataParser {
    /**
     * 解析文件
     * Parse markdown file
     */
    parseFile(filePath: string): Promise<ParsedArticle>;
    /**
     * 提取frontmatter元数据
     * Extract frontmatter metadata
     */
    extractFrontmatter(data: any, filePath: string): ArticleMetadata;
    /**
     * 处理markdown内容
     * Process markdown content
     */
    processMarkdown(content: string): string;
    /**
     * 计算字数
     * Calculate word count
     */
    private calculateWordCount;
    /**
     * 提取标题
     * Extract title from frontmatter or filename
     */
    private extractTitle;
    /**
     * 提取日期
     * Extract date from frontmatter or file stats
     */
    private extractDate;
    /**
     * 提取标签
     * Extract tags from frontmatter
     */
    private extractTags;
    /**
     * 提取描述
     * Extract description from frontmatter
     */
    private extractDescription;
    /**
     * 提取草稿状态
     * Extract draft status from frontmatter
     */
    private extractDraft;
    /**
     * 提取或生成slug
     * Extract or generate slug from frontmatter or filename
     */
    private extractSlug;
    /**
     * 创建URL友好的slug
     * Create URL-friendly slug
     */
    private createSlug;
}
//# sourceMappingURL=MetadataParser.d.ts.map