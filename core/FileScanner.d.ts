/**
 * 文件扫描器
 * File Scanner for discovering markdown files in Obsidian vault
 */
import { ScanResult, FileStats } from '../types';
export declare class FileScanner {
    private static readonly MARKDOWN_EXTENSIONS;
    /**
     * 扫描vault目录
     * Scan vault directory for markdown files
     */
    scanVault(vaultPath: string): Promise<ScanResult>;
    /**
     * 递归扫描目录
     * Recursively scan directory
     */
    private scanDirectory;
    /**
     * 检查是否为markdown文件
     * Check if file is a markdown file
     */
    isMarkdownFile(filePath: string): boolean;
    /**
     * 获取文件统计信息
     * Get file statistics
     */
    getFileStats(filePath: string): Promise<FileStats>;
    /**
     * 确定错误类型
     * Determine error type
     */
    private getErrorType;
}
//# sourceMappingURL=FileScanner.d.ts.map