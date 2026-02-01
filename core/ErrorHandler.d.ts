/**
 * 错误处理器
 * Error Handler for graceful error handling and recovery
 */
import { ErrorHandler, ConfigError, FileError, ParseError, GenerationError, ProgressReport, BreakpointState, ProgressCallback } from '../types';
export declare class GracefulErrorHandler implements ErrorHandler {
    private errors;
    private progressCallbacks;
    private breakpointFilePath;
    constructor(tempDirOverride?: string);
    /**
     * 处理配置错误
     * Handle configuration errors
     */
    handleConfigError(error: ConfigError): void;
    /**
     * 处理文件错误
     * Handle file system errors
     */
    handleFileError(error: FileError): void;
    /**
     * 处理解析错误
     * Handle parsing errors
     */
    handleParseError(error: ParseError): void;
    /**
     * 处理生成错误
     * Handle generation errors
     */
    handleGenerationError(error: GenerationError): void;
    /**
     * 报告进度
     * Report progress to subscribers
     */
    reportProgress(report: ProgressReport): void;
    /**
     * 订阅进度更新
     * Subscribe to progress updates
     * @returns unsubscribe function
     */
    subscribeProgress(callback: ProgressCallback): () => void;
    /**
     * 保存断点状态
     * Save checkpoint state to file
     */
    saveBreakpoint(state: BreakpointState): Promise<void>;
    /**
     * 加载断点状态
     * Load checkpoint state from file
     */
    loadBreakpoint(): Promise<BreakpointState | null>;
    /**
     * 清除断点状态
     * Clear checkpoint state from file
     */
    clearBreakpoint(): Promise<void>;
    /**
     * 获取错误统计
     * Get error statistics
     */
    getErrorStats(): {
        total: number;
        byType: Record<string, number>;
    };
    /**
     * 清除错误记录
     * Clear error records
     */
    clearErrors(): void;
    /**
     * 获取所有错误
     * Get all errors
     */
    getAllErrors(): Array<{
        type: string;
        error: Error;
        timestamp: Date;
    }>;
    /**
     * 记录错误
     * Log error internally
     */
    private logError;
    /**
     * 生成错误报告
     * Generate error report
     */
    generateErrorReport(): string;
}
//# sourceMappingURL=ErrorHandler.d.ts.map