/**
 * 核心数据接口和类型定义
 * Core data interfaces and type definitions for Obsidian Blog Generator
 */
export interface BlogConfig {
    vaultPath: string;
    outputPath: string;
    siteTitle: string;
    siteDescription: string;
    author: string;
    theme: 'light' | 'dark' | 'auto';
    postsPerPage: number;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export interface ScanResult {
    files: string[];
    errors: ScanError[];
    totalSize: number;
}
export interface ScanError {
    filePath: string;
    error: string;
    type: 'permission' | 'not_found' | 'invalid_format' | 'other';
}
export interface FileStats {
    size: number;
    created: Date;
    modified: Date;
    isDirectory: boolean;
}
export interface ArticleMetadata {
    title: string;
    date: Date;
    tags: string[];
    description?: string;
    draft?: boolean;
    slug?: string;
}
export interface ParsedArticle {
    metadata: ArticleMetadata;
    content: string;
    filePath: string;
    wordCount: number;
}
export interface Article {
    id: string;
    title: string;
    slug: string;
    date: Date;
    tags: string[];
    description: string;
    content: string;
    htmlContent: string;
    wordCount: number;
    readingTime: number;
    filePath: string;
    isDraft: boolean;
}
export interface GenerationOptions {
    config: BlogConfig;
    articles: ParsedArticle[];
    outputPath: string;
}
export interface SiteData {
    config: BlogConfig;
    articles: Article[];
    tags: TagInfo[];
    recentArticles: Article[];
    totalArticles: number;
    lastUpdated: Date;
}
export interface TagInfo {
    name: string;
    count: number;
    articles: Article[];
}
export interface SearchIndexEntry {
    articleIndex: number;
    weight: number;
}
export interface SearchIndex {
    articles: SearchableArticle[];
    index: Map<string, SearchIndexEntry[]>;
}
export interface SearchableArticle {
    id: string;
    title: string;
    content: string;
    tags: string[];
    slug: string;
}
export interface SearchMatchLocation {
    inTitle: boolean;
    inContent: boolean;
    inTags: boolean;
}
export interface SearchResult {
    article: ParsedArticle;
    score: number;
    highlights: string[];
    matchLocations?: SearchMatchLocation;
}
export declare class ConfigError extends Error {
    field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
export declare class FileError extends Error {
    filePath: string;
    constructor(message: string, filePath: string);
}
export declare class ParseError extends Error {
    filePath: string;
    constructor(message: string, filePath: string);
}
export declare class GenerationError extends Error {
    context?: string | undefined;
    constructor(message: string, context?: string | undefined);
}
export interface ProgressReport {
    stage: string;
    current: number;
    total: number;
    message: string;
}
export interface BreakpointState {
    stage: string;
    progress: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
export type ProgressCallback = (report: ProgressReport) => void;
export interface ErrorHandler {
    handleConfigError(error: ConfigError): void;
    handleFileError(error: FileError): void;
    handleParseError(error: ParseError): void;
    handleGenerationError(error: GenerationError): void;
    reportProgress(report: ProgressReport): void;
    subscribeProgress(callback: ProgressCallback): () => void;
    saveBreakpoint(state: BreakpointState): Promise<void>;
    loadBreakpoint(): Promise<BreakpointState | null>;
    clearBreakpoint(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map