"use strict";
/**
 * 网站生成器
 * Site Generator for creating HTML pages and static assets
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteGenerator = void 0;
const types_1 = require("../types");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const marked_1 = require("marked");
// 配置marked选项
marked_1.marked.setOptions({
    gfm: true,
    breaks: true
});
class SiteGenerator {
    constructor() {
        this.templateCache = new Map();
    }
    /**
     * 生成网站
     * Generate complete website
     */
    async generateSite(options) {
        try {
            // 确保输出目录存在
            await fs.ensureDir(options.outputPath);
            // 转换文章数据
            const articles = this.convertToArticles(options.articles);
            // 生成各种页面
            await this.generateHomePage(articles, options);
            await this.generateArticleList(articles, options);
            await this.generateArticlePages(articles, options);
            await this.generateSearchPage(options);
            // 复制静态资源
            await this.copyStaticAssets(options.outputPath);
        }
        catch (error) {
            throw new types_1.GenerationError(`网站生成失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 生成首页
     * Generate home page
     */
    async generateHomePage(articles, options) {
        const recentArticles = articles
            .filter(article => !article.isDraft)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5);
        const layoutTemplate = await this.loadTemplate('layout.html');
        const content = `
      <section class="hero">
        <h1 class="hero-title">${options.config.siteTitle}</h1>
        <p class="hero-subtitle">${options.config.siteDescription}</p>
      </section>
      
      <section class="recent-articles">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <a href="articles.html" class="section-link">查看全部 →</a>
        </div>
        <div class="article-grid">
          ${recentArticles.map(article => this.renderArticleCard(article)).join('')}
        </div>
      </section>
      
      <section class="featured-content">
        <div class="featured-grid">
          <div class="featured-item">
            <h3>文章总数</h3>
            <p>${articles.filter(a => !a.isDraft).length}</p>
          </div>
          <div class="featured-item">
            <h3>标签云</h3>
            <div class="tag-cloud">
              ${this.getPopularTags(articles).slice(0, 10).map(tag => `<span class="tag">#${tag.name}</span>`).join('')}
            </div>
          </div>
          <div class="featured-item">
            <h3>最近更新</h3>
            <p>${this.formatDate(new Date())}</p>
          </div>
        </div>
      </section>
    `;
        const html = this.renderTemplate(layoutTemplate, {
            title: '首页',
            siteTitle: options.config.siteTitle,
            siteDescription: options.config.siteDescription,
            description: options.config.siteDescription,
            bodyClass: 'home-page',
            homeActive: 'active',
            articlesActive: '',
            searchActive: '',
            currentYear: new Date().getFullYear(),
            author: options.config.author || options.config.siteTitle,
            content,
            additionalHead: ''
        });
        await fs.writeFile(path.join(options.outputPath, 'index.html'), html);
    }
    /**
     * 生成文章列表页
     * Generate article list page
     */
    async generateArticleList(articles, options) {
        const publishedArticles = articles
            .filter(article => !article.isDraft)
            .sort((a, b) => b.date.getTime() - a.date.getTime());
        const layoutTemplate = await this.loadTemplate('layout.html');
        const content = `
      <div class="articles-filters">
        <div class="filter-group">
          <label for="sort-select">排序方式:</label>
          <select id="sort-select" class="filter-select">
            <option value="date-desc">最新发布</option>
            <option value="date-asc">最早发布</option>
            <option value="title-asc">标题 A-Z</option>
            <option value="title-desc">标题 Z-A</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="tag-filter">标签筛选:</label>
          <select id="tag-filter" class="filter-select">
            <option value="">所有标签</option>
            ${this.getPopularTags(articles).map(tag => `<option value="${tag.name}">#${tag.name} (${tag.count})</option>`).join('')}
          </select>
        </div>
      </div>
      
      <div class="article-list">
        ${publishedArticles.map(article => this.renderArticleListItem(article)).join('')}
      </div>
    `;
        const html = this.renderTemplate(layoutTemplate, {
            title: '文章列表',
            siteTitle: options.config.siteTitle,
            siteDescription: options.config.siteDescription,
            description: '所有文章列表',
            bodyClass: 'articles-page',
            homeActive: '',
            articlesActive: 'active',
            searchActive: '',
            currentYear: new Date().getFullYear(),
            author: options.config.author || options.config.siteTitle,
            content,
            additionalHead: ''
        });
        await fs.writeFile(path.join(options.outputPath, 'articles.html'), html);
    }
    /**
     * 生成搜索页面
     * Generate search page
     */
    async generateSearchPage(options) {
        const layoutTemplate = await this.loadTemplate('layout.html');
        const searchTemplate = await this.loadTemplate('search.html');
        const content = this.renderTemplate(searchTemplate, {});
        const html = this.renderTemplate(layoutTemplate, {
            title: '搜索',
            siteTitle: options.config.siteTitle,
            siteDescription: options.config.siteDescription,
            description: '搜索文章',
            bodyClass: 'search-page',
            homeActive: '',
            articlesActive: '',
            searchActive: 'active',
            currentYear: new Date().getFullYear(),
            author: options.config.author || options.config.siteTitle,
            content,
            additionalHead: ''
        });
        await fs.writeFile(path.join(options.outputPath, 'search.html'), html);
    }
    async generateArticlePages(articles, options) {
        const layoutTemplate = await this.loadTemplate('layout.html');
        const articleTemplate = await this.loadTemplate('article.html');
        for (const article of articles) {
            if (!article.isDraft) {
                // 处理文章内容中的Obsidian链接
                const processedContent = this.processObsidianLinks(article.htmlContent, articles);
                const content = this.renderTemplate(articleTemplate, {
                    title: article.title,
                    content: processedContent,
                    date: this.formatDate(article.date),
                    dateISO: article.date.toISOString(),
                    readingTime: article.readingTime,
                    wordCount: article.wordCount,
                    tags: article.tags,
                    tableOfContents: this.generateTableOfContents(article.htmlContent),
                    relatedArticles: this.getRelatedArticles(article, articles).slice(0, 3)
                });
                const html = this.renderTemplate(layoutTemplate, {
                    title: article.title,
                    siteTitle: options.config.siteTitle,
                    siteDescription: options.config.siteDescription,
                    description: article.description,
                    bodyClass: 'article-page',
                    homeActive: '',
                    articlesActive: '',
                    searchActive: '',
                    currentYear: new Date().getFullYear(),
                    author: options.config.author || options.config.siteTitle,
                    content,
                    additionalHead: `<meta property="og:title" content="${article.title}">
<meta property="og:description" content="${article.description}">
<meta property="og:type" content="article">
<meta property="article:published_time" content="${article.date.toISOString()}">
<meta property="article:author" content="${options.config.author || options.config.siteTitle}">`
                });
                await fs.writeFile(path.join(options.outputPath, `${article.slug}.html`), html);
            }
        }
    }
    /**
     * 复制静态资源
     * Copy static assets
     */
    async copyStaticAssets(outputPath) {
        const templatesPath = path.join(process.cwd(), 'templates');
        const assetsSourcePath = path.join(templatesPath, 'assets');
        const assetsDestPath = path.join(outputPath, 'assets');
        // 确保目标目录存在
        await fs.ensureDir(assetsDestPath);
        // 复制CSS和JS文件
        if (await fs.pathExists(assetsSourcePath)) {
            await fs.copy(assetsSourcePath, assetsDestPath);
        }
        else {
            // 如果模板资源不存在，创建基本目录结构
            await fs.ensureDir(path.join(assetsDestPath, 'css'));
            await fs.ensureDir(path.join(assetsDestPath, 'js'));
        }
    }
    /**
     * 转换为完整的文章数据结构
     * Convert parsed articles to full article data structure
     */
    convertToArticles(parsedArticles) {
        return parsedArticles.map(parsed => ({
            id: this.generateId(parsed.filePath),
            title: parsed.metadata.title,
            slug: parsed.metadata.slug || this.createSlug(parsed.metadata.title),
            date: parsed.metadata.date,
            tags: parsed.metadata.tags,
            description: parsed.metadata.description || this.extractDescription(parsed.content),
            content: parsed.content,
            htmlContent: this.convertMarkdownToHtml(parsed.content),
            wordCount: parsed.wordCount,
            readingTime: Math.ceil(parsed.wordCount / 200), // 假设每分钟200字
            filePath: parsed.filePath,
            isDraft: parsed.metadata.draft || false
        }));
    }
    /**
     * 加载模板文件
     * Load template file
     */
    async loadTemplate(templateName) {
        if (this.templateCache.has(templateName)) {
            return this.templateCache.get(templateName);
        }
        const templatePath = path.join(process.cwd(), 'templates', templateName);
        if (await fs.pathExists(templatePath)) {
            const template = await fs.readFile(templatePath, 'utf-8');
            this.templateCache.set(templateName, template);
            return template;
        }
        throw new types_1.GenerationError(`模板文件不存在: ${templatePath}`);
    }
    /**
     * 渲染模板
     * Render template with data
     */
    renderTemplate(template, data) {
        let result = template;
        // 处理循环语句 {{#each array}}...{{/each}} (需要在普通变量替换之前处理嵌套内容)
        result = result.replace(/{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g, (match, arrayName, itemTemplate) => {
            const array = data[arrayName];
            if (Array.isArray(array)) {
                return array.map(item => {
                    let itemHtml = itemTemplate;
                    if (typeof item === 'object') {
                        for (const [key, value] of Object.entries(item)) {
                            const regex = new RegExp(`{{${key}}}`, 'g');
                            itemHtml = itemHtml.replace(regex, String(value || ''));
                        }
                    }
                    else {
                        itemHtml = itemHtml.replace(/{{this}}/g, String(item));
                    }
                    return itemHtml;
                }).join('');
            }
            return '';
        });
        // 处理条件语句 {{#if condition}}...{{/if}} (同样在普通变量替换之前处理)
        result = result.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, condition, content) => {
            return data[condition] ? content : '';
        });
        // 简单的模板替换 (处理最终值，应在复杂结构之后)
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, String(value || ''));
        }
        // 处理三重括号 {{{content}}} 用于输出未转义内容 (必须在普通变量替换之前处理)
        result = result.replace(/\{\{\{(\w+)\}\}\}/g, (match, key) => {
            if (data.hasOwnProperty(key)) {
                return String(data[key]);
            }
            // 如果键不存在，不替换而是保持原样，让后续处理处理
            return match;
        });
        // 处理双大括号 {{content}} 用于转义输出 (必须在普通变量替换之前处理)
        result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            if (data.hasOwnProperty(key)) {
                // 对内容进行HTML转义以防止XSS
                const value = String(data[key] || '');
                return value
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#x27;');
            }
            return match; // 如果键不存在，保持原始标记不变
        });
        // 最后处理简单变量替换 {{key}} (针对对象的属性)
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, String(value || ''));
        }
        // 清理未处理的模板标记，但要小心不要移除过多内容
        result = result.replace(/\{\{[^{}]*\}\}/g, '');
        // 修剪结果
        result = result.trim();
        return result;
    }
    /**
     * 转换Markdown为HTML
     * Convert markdown to HTML
     */
    convertMarkdownToHtml(markdown) {
        return (0, marked_1.marked)(markdown);
    }
    /**
     * 处理Obsidian内部链接
     * Process Obsidian internal links
     */
    processObsidianLinks(htmlContent, articles) {
        // 处理 [[文章标题]] 格式的内部链接
        return htmlContent.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
            // 查找匹配的文章
            const targetArticle = articles.find(article => article.title === linkText ||
                article.slug === this.createSlug(linkText) ||
                article.id === linkText);
            if (targetArticle) {
                return `<a href="${targetArticle.slug}.html" class="internal-link">${linkText}</a>`;
            }
            else {
                // 如果找不到对应文章，保持原样但添加样式
                return `<span class="broken-link">${linkText}</span>`;
            }
        });
    }
    /**
     * 生成目录
     * Generate table of contents
     */
    generateTableOfContents(htmlContent) {
        const headings = htmlContent.match(/<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g);
        if (!headings)
            return '';
        const tocItems = headings.map(heading => {
            const level = parseInt(heading.match(/<h([1-6])/)?.[1] || '1');
            const text = heading.replace(/<[^>]*>/g, '');
            const id = this.createSlug(text);
            return { level, text, id };
        });
        let toc = '<ul class="toc-list">';
        for (const item of tocItems) {
            toc += `<li class="toc-level-${item.level}">
        <a href="#${item.id}" class="toc-link">${item.text}</a>
      </li>`;
        }
        toc += '</ul>';
        return toc;
    }
    /**
     * 获取相关文章
     * Get related articles based on tags
     */
    getRelatedArticles(currentArticle, allArticles) {
        const otherArticles = allArticles.filter(article => article.id !== currentArticle.id && !article.isDraft);
        // 基于标签相似度排序
        const scored = otherArticles.map(article => {
            const commonTags = article.tags.filter(tag => currentArticle.tags.includes(tag)).length;
            return { article, score: commonTags };
        });
        return scored
            .sort((a, b) => b.score - a.score)
            .map(item => item.article);
    }
    /**
     * 获取热门标签
     * Get popular tags
     */
    getPopularTags(articles) {
        const tagCounts = new Map();
        articles
            .filter(article => !article.isDraft)
            .forEach(article => {
            article.tags.forEach(tag => {
                tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * 渲染文章卡片
     * Render article card for home page
     */
    renderArticleCard(article) {
        return `
    <div class="article-card">
        <h3><a href="${article.slug}.html">${article.title}</a></h3>
        <p class="article-excerpt">${article.description}</p>
        <div class="article-meta">
            <time datetime="${article.date.toISOString()}">${this.formatDate(article.date)}</time>
            <span class="reading-time">${article.readingTime} 分钟</span>
        </div>
    </div>`;
    }
    /**
     * 渲染文章列表项
     * Render article list item
     */
    renderArticleListItem(article) {
        return `
    <div class="article-item">
        <h3><a href="${article.slug}.html">${article.title}</a></h3>
        <p class="article-excerpt">${article.description}</p>
        <div class="article-meta">
            <time datetime="${article.date.toISOString()}">${this.formatDate(article.date)}</time>
            <span class="reading-time">${article.readingTime} 分钟阅读</span>
            ${article.tags.length > 0 ? `<div class="tags">${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>` : ''}
        </div>
    </div>`;
    }
    /**
     * 生成文章ID
     * Generate article ID
     */
    generateId(filePath) {
        return path.basename(filePath, path.extname(filePath));
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
    /**
     * 从内容中提取描述
     * Extract description from content
     */
    extractDescription(content, maxLength = 150) {
        const plainText = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]+`/g, '')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/[#*_~`]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return plainText.length > maxLength
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    }
    /**
     * 格式化日期
     * Format date for display
     */
    formatDate(date) {
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}
exports.SiteGenerator = SiteGenerator;
//# sourceMappingURL=SiteGenerator.js.map