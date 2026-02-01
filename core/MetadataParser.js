"use strict";
/**
 * 元数据解析器
 * Metadata Parser for extracting frontmatter and processing markdown content
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataParser = void 0;
const types_1 = require("../types");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
class MetadataParser {
    /**
     * 解析文件
     * Parse markdown file
     */
    async parseFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const parsed = (0, gray_matter_1.default)(content);
            const metadata = this.extractFrontmatter(parsed.data, filePath);
            const processedContent = this.processMarkdown(parsed.content);
            const wordCount = this.calculateWordCount(processedContent);
            return {
                metadata,
                content: processedContent,
                filePath,
                wordCount
            };
        }
        catch (error) {
            throw new types_1.ParseError(`解析文件失败: ${error instanceof Error ? error.message : String(error)}`, filePath);
        }
    }
    /**
     * 提取frontmatter元数据
     * Extract frontmatter metadata
     */
    extractFrontmatter(data, filePath) {
        const fileName = path.basename(filePath, path.extname(filePath));
        // 从文件统计信息获取默认日期
        let defaultDate;
        try {
            const stats = fs.statSync(filePath);
            defaultDate = stats.mtime;
        }
        catch {
            defaultDate = new Date();
        }
        return {
            title: this.extractTitle(data, fileName),
            date: this.extractDate(data, defaultDate),
            tags: this.extractTags(data),
            description: this.extractDescription(data),
            draft: this.extractDraft(data),
            slug: this.extractSlug(data, fileName)
        };
    }
    /**
     * 处理markdown内容
     * Process markdown content
     */
    processMarkdown(content) {
        // 移除多余的空行
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        // 处理Obsidian内部链接 [[link]] -> <a href="link.html" class="internal-link">link</a>
        content = content.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
            const slug = this.createSlug(linkText);
            return `<a href="${slug}.html" class="internal-link">${linkText}</a>`;
        });
        // 处理Obsidian标签 #tag
        content = content.replace(/#([a-zA-Z0-9\u4e00-\u9fa5_-]+)/g, '<span class="tag">#$1</span>');
        return content.trim();
    }
    /**
     * 计算字数
     * Calculate word count
     */
    calculateWordCount(content) {
        // 移除markdown语法和HTML标签
        const plainText = content
            .replace(/```[\s\S]*?```/g, '') // 代码块
            .replace(/`[^`]+`/g, '') // 行内代码
            .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
            .replace(/\[.*?\]\(.*?\)/g, '') // 链接
            .replace(/<[^>]*>/g, '') // HTML标签
            .replace(/[#*_~`]/g, '') // markdown符号
            .replace(/\s+/g, ' ') // 多个空格合并
            .trim();
        // 中英文混合字数统计
        const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
        const englishWords = plainText.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(word => word.length > 0).length;
        return chineseChars + englishWords;
    }
    /**
     * 提取标题
     * Extract title from frontmatter or filename
     */
    extractTitle(data, fileName) {
        if (data.title && typeof data.title === 'string') {
            return data.title.trim();
        }
        // 从文件名生成标题
        return fileName
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    }
    /**
     * 提取日期
     * Extract date from frontmatter or file stats
     */
    extractDate(data, defaultDate) {
        if (data.date) {
            const date = new Date(data.date);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        if (data.created) {
            const date = new Date(data.created);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
        return defaultDate;
    }
    /**
     * 提取标签
     * Extract tags from frontmatter
     */
    extractTags(data) {
        if (Array.isArray(data.tags)) {
            return data.tags.filter((tag) => typeof tag === 'string').map((tag) => tag.trim());
        }
        if (typeof data.tags === 'string') {
            return data.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
        }
        if (Array.isArray(data.tag)) {
            return data.tag.filter((tag) => typeof tag === 'string').map((tag) => tag.trim());
        }
        return [];
    }
    /**
     * 提取描述
     * Extract description from frontmatter
     */
    extractDescription(data) {
        if (data.description && typeof data.description === 'string') {
            return data.description.trim();
        }
        if (data.summary && typeof data.summary === 'string') {
            return data.summary.trim();
        }
        return undefined;
    }
    /**
     * 提取草稿状态
     * Extract draft status from frontmatter
     */
    extractDraft(data) {
        if (typeof data.draft === 'boolean') {
            return data.draft;
        }
        if (typeof data.draft === 'string') {
            return data.draft.toLowerCase() === 'true';
        }
        return false;
    }
    /**
     * 提取或生成slug
     * Extract or generate slug from frontmatter or filename
     */
    extractSlug(data, fileName) {
        if (data.slug && typeof data.slug === 'string') {
            return this.createSlug(data.slug);
        }
        return this.createSlug(fileName);
    }
    /**
     * 创建URL友好的slug
     * Create URL-friendly slug
     */
    createSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 移除特殊字符，保留中文字符
            .replace(/[\s_-]+/g, '-') // 空格和下划线转为连字符
            .replace(/^-+|-+$/g, ''); // 移除首尾连字符
    }
}
exports.MetadataParser = MetadataParser;
//# sourceMappingURL=MetadataParser.js.map