"use strict";
/**
 * Obsidian博客生成器主入口
 * Main entry point for Obsidian Blog Generator
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.ObsidianBlogGenerator = exports.GracefulErrorHandler = exports.SearchCoordinator = exports.SearchEngine = exports.SiteGenerator = exports.MetadataParser = exports.FileScanner = exports.ConfigManager = void 0;
// 导出核心类型
__exportStar(require("./types"), exports);
// 导出核心组件
var ConfigManager_1 = require("./core/ConfigManager");
Object.defineProperty(exports, "ConfigManager", { enumerable: true, get: function () { return ConfigManager_1.ConfigManager; } });
var FileScanner_1 = require("./core/FileScanner");
Object.defineProperty(exports, "FileScanner", { enumerable: true, get: function () { return FileScanner_1.FileScanner; } });
var MetadataParser_1 = require("./core/MetadataParser");
Object.defineProperty(exports, "MetadataParser", { enumerable: true, get: function () { return MetadataParser_1.MetadataParser; } });
var SiteGenerator_1 = require("./core/SiteGenerator");
Object.defineProperty(exports, "SiteGenerator", { enumerable: true, get: function () { return SiteGenerator_1.SiteGenerator; } });
var SearchEngine_1 = require("./core/SearchEngine"); // Keep for backward compatibility
Object.defineProperty(exports, "SearchEngine", { enumerable: true, get: function () { return SearchEngine_1.SearchEngine; } });
var SearchCoordinator_1 = require("./core/SearchCoordinator"); // New export
Object.defineProperty(exports, "SearchCoordinator", { enumerable: true, get: function () { return SearchCoordinator_1.SearchCoordinator; } });
var ErrorHandler_1 = require("./core/ErrorHandler");
Object.defineProperty(exports, "GracefulErrorHandler", { enumerable: true, get: function () { return ErrorHandler_1.GracefulErrorHandler; } });
// 导入核心组件用于内部使用
const ConfigManager_2 = require("./core/ConfigManager");
const FileScanner_2 = require("./core/FileScanner");
const MetadataParser_2 = require("./core/MetadataParser");
const SiteGenerator_2 = require("./core/SiteGenerator");
const SearchCoordinator_2 = require("./core/SearchCoordinator"); // Changed import
const ErrorHandler_2 = require("./core/ErrorHandler");
const types_1 = require("./types");
// 导入系统模块
const path = __importStar(require("path"));
// 主要功能类
class ObsidianBlogGenerator {
    constructor() {
        this.configManager = new ConfigManager_2.ConfigManager();
        this.fileScanner = new FileScanner_2.FileScanner();
        this.metadataParser = new MetadataParser_2.MetadataParser();
        this.siteGenerator = new SiteGenerator_2.SiteGenerator();
        this.searchEngine = new SearchCoordinator_2.SearchCoordinator(); // Changed instantiation
        this.errorHandler = new ErrorHandler_2.GracefulErrorHandler(); // No temp dir override in production
    }
    /**
     * 生成博客网站
     * Generate blog website
     */
    async generate(configPath, resumeFromBreakpoint = false) {
        try {
            // 检查是否需要从断点恢复
            if (resumeFromBreakpoint) {
                const breakpoint = await this.errorHandler.loadBreakpoint();
                if (breakpoint) {
                    console.log(`🔄 尝试从断点恢复: ${breakpoint.stage} (${Math.round(breakpoint.progress)}%)`);
                    // 简单实现：直接提示用户断点恢复逻辑
                    console.log('💡 断点恢复功能待完善：当前仅支持从指定阶段开始重新运行整个流程');
                }
            }
            console.log('🚀 开始生成博客网站...');
            // 注册进度报告
            const unsubscribe = this.errorHandler.subscribeProgress((report) => {
                // 在这里可以添加额外的进度处理逻辑
                // 比如更新UI、记录日志到文件等
            });
            // 1. 加载配置
            this.errorHandler.reportProgress({ stage: 'CONFIG', current: 1, total: 6, message: '加载配置...' });
            console.log('📋 加载配置...');
            const config = await this.configManager.loadConfig(configPath);
            console.log(`   Vault路径: ${config.vaultPath}`);
            console.log(`   输出路径: ${config.outputPath}`);
            // 保存配置阶段的断点
            await this.errorHandler.saveBreakpoint({
                stage: 'CONFIG_LOADED',
                progress: 15,
                timestamp: new Date(),
                metadata: { outputPath: config.outputPath, vaultPath: config.vaultPath }
            });
            // 2. 扫描文件
            this.errorHandler.reportProgress({ stage: 'SCANNING', current: 2, total: 6, message: '扫描Markdown文件...' });
            console.log('🔍 扫描Markdown文件...');
            const scanResult = await this.fileScanner.scanVault(config.vaultPath);
            console.log(`   找到 ${scanResult.files.length} 个文件`);
            if (scanResult.errors.length > 0) {
                console.warn(`   ${scanResult.errors.length} 个文件扫描错误`);
                scanResult.errors.forEach((error) => {
                    this.errorHandler.handleFileError(new types_1.FileError(error.error, error.filePath));
                });
            }
            // 保存扫描阶段的断点
            await this.errorHandler.saveBreakpoint({
                stage: 'FILES_SCANNED',
                progress: 30,
                timestamp: new Date(),
                metadata: { fileCount: scanResult.files.length }
            });
            // 3. 解析文章
            this.errorHandler.reportProgress({ stage: 'PARSING', current: 3, total: 6, message: '解析文章内容...' });
            console.log('📝 解析文章内容...');
            const articles = [];
            const totalFiles = scanResult.files.length;
            for (let i = 0; i < scanResult.files.length; i++) {
                const filePath = scanResult.files[i];
                try {
                    const article = await this.metadataParser.parseFile(filePath);
                    articles.push(article);
                    // 报告解析进度
                    this.errorHandler.reportProgress({
                        stage: 'PARSING',
                        current: i + 1,
                        total: totalFiles,
                        message: `正在解析: ${path.basename(filePath)}`
                    });
                }
                catch (error) {
                    this.errorHandler.handleParseError(error);
                }
            }
            console.log(`   成功解析 ${articles.length} 篇文章`);
            // 保存解析阶段的断点
            await this.errorHandler.saveBreakpoint({
                stage: 'ARTICLES_PARSED',
                progress: 50,
                timestamp: new Date(),
                metadata: { articleCount: articles.length }
            });
            // 4. 构建搜索索引
            this.errorHandler.reportProgress({ stage: 'INDEXING', current: 4, total: 6, message: '构建搜索索引...' });
            console.log('🔎 构建搜索索引...');
            const searchIndex = this.searchEngine.buildIndex(articles);
            console.log(`   索引了 ${searchIndex.articles.length} 篇文章`);
            // 保存索引阶段的断点
            await this.errorHandler.saveBreakpoint({
                stage: 'SEARCH_INDEXED',
                progress: 70,
                timestamp: new Date(),
                metadata: { indexedCount: searchIndex.articles.length }
            });
            // 5. 生成网站
            this.errorHandler.reportProgress({ stage: 'GENERATING', current: 5, total: 6, message: '生成网站页面...' });
            console.log('🏗️  生成网站页面...');
            await this.siteGenerator.generateSite({
                config,
                articles,
                outputPath: config.outputPath
            });
            // 6. 生成搜索数据
            this.errorHandler.reportProgress({ stage: 'SAVING_SEARCH_DATA', current: 6, total: 6, message: '生成搜索数据...' });
            console.log('💾 生成搜索数据...');
            const fs = require('fs-extra');
            const assetsPath = path.join(config.outputPath, 'assets', 'js');
            await fs.ensureDir(assetsPath); // 确保目录存在
            const searchData = this.searchEngine.generateSearchData(searchIndex);
            await fs.writeFile(path.join(config.outputPath, 'assets', 'js', 'search-data.json'), searchData);
            // 清除断点文件（生成完成）
            await this.errorHandler.clearBreakpoint();
            console.log('✅ 博客网站生成完成!');
            console.log(`   输出目录: ${config.outputPath}`);
            // 显示错误统计
            const errorStats = this.errorHandler.getErrorStats();
            if (errorStats.total > 0) {
                console.log(this.errorHandler.generateErrorReport());
            }
            // 取消订阅进度报告
            unsubscribe();
            return true;
        }
        catch (error) {
            const unsubscribe = this.errorHandler.subscribeProgress((report) => {
                // 记录错误时的进度信息
                console.error(`❌ 错误发生在阶段: ${report.stage}, 进度: ${report.current}/${report.total}`);
            });
            if (error instanceof types_1.ConfigError) {
                this.errorHandler.handleConfigError(error);
            }
            else if (error instanceof types_1.GenerationError) {
                this.errorHandler.handleGenerationError(error);
            }
            else {
                console.error('❌ 未知错误:', error);
            }
            unsubscribe();
            throw error;
        }
    }
    /**
     * 获取错误处理器
     * Get error handler
     */
    getErrorHandler() {
        return this.errorHandler;
    }
}
exports.ObsidianBlogGenerator = ObsidianBlogGenerator;
//# sourceMappingURL=index.js.map