/**
 * Obsidian博客生成器主入口
 * Main entry point for Obsidian Blog Generator
 */
export * from './types';
export { ConfigManager } from './core/ConfigManager';
export { FileScanner } from './core/FileScanner';
export { MetadataParser } from './core/MetadataParser';
export { SiteGenerator } from './core/SiteGenerator';
export { SearchEngine } from './core/SearchEngine';
export { SearchCoordinator } from './core/SearchCoordinator';
export { GracefulErrorHandler } from './core/ErrorHandler';
import { GracefulErrorHandler } from './core/ErrorHandler';
export declare class ObsidianBlogGenerator {
    private configManager;
    private fileScanner;
    private metadataParser;
    private siteGenerator;
    private searchEngine;
    private errorHandler;
    constructor();
    /**
     * 生成博客网站
     * Generate blog website
     */
    generate(configPath?: string, resumeFromBreakpoint?: boolean): Promise<boolean>;
    /**
     * 获取错误处理器
     * Get error handler
     */
    getErrorHandler(): GracefulErrorHandler;
}
//# sourceMappingURL=index.d.ts.map