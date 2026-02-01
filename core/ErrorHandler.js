"use strict";
/**
 * 错误处理器
 * Error Handler for graceful error handling and recovery
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
exports.GracefulErrorHandler = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
class GracefulErrorHandler {
    constructor(tempDirOverride) {
        this.errors = [];
        this.progressCallbacks = [];
        // Use override directory if provided (for tests), otherwise use system temp
        const tempDir = tempDirOverride || path.join(os.tmpdir(), `obsidian-blog-generator-${Date.now()}-${Math.random()}`);
        fs.ensureDirSync(tempDir);
        this.breakpointFilePath = path.join(tempDir, '.blog_generator_breakpoint.json');
    }
    /**
     * 处理配置错误
     * Handle configuration errors
     */
    handleConfigError(error) {
        this.logError('CONFIG', error);
        console.error(`❌ 配置错误: ${error.message}`);
        if (error.field) {
            console.error(`   字段: ${error.field}`);
        }
        console.error('   请检查配置文件并修正错误后重试。');
    }
    /**
     * 处理文件错误
     * Handle file system errors
     */
    handleFileError(error) {
        this.logError('FILE', error);
        console.warn(`⚠️  文件错误: ${error.message}`);
        console.warn(`   文件路径: ${error.filePath}`);
        console.warn('   跳过此文件，继续处理其他文件...');
    }
    /**
     * 处理解析错误
     * Handle parsing errors
     */
    handleParseError(error) {
        this.logError('PARSE', error);
        console.warn(`⚠️  解析错误: ${error.message}`);
        console.warn(`   文件路径: ${error.filePath}`);
        console.warn('   跳过此文件，继续处理其他文件...');
    }
    /**
     * 处理生成错误
     * Handle generation errors
     */
    handleGenerationError(error) {
        this.logError('GENERATION', error);
        console.error(`❌ 生成错误: ${error.message}`);
        if (error.context) {
            console.error(`   上下文: ${error.context}`);
        }
        console.error('   生成过程已中断。');
    }
    /**
     * 报告进度
     * Report progress to subscribers
     */
    reportProgress(report) {
        console.log(`📊 [${report.stage}] ${report.current}/${report.total} - ${report.message}`);
        // 调用所有进度回调函数
        this.progressCallbacks.forEach(callback => {
            try {
                callback(report);
            }
            catch (err) {
                console.error('❌ 进度回调函数执行错误:', err);
            }
        });
    }
    /**
     * 订阅进度更新
     * Subscribe to progress updates
     * @returns unsubscribe function
     */
    subscribeProgress(callback) {
        this.progressCallbacks.push(callback);
        // 返回取消订阅函数
        return () => {
            const index = this.progressCallbacks.indexOf(callback);
            if (index !== -1) {
                this.progressCallbacks.splice(index, 1);
            }
        };
    }
    /**
     * 保存断点状态
     * Save checkpoint state to file
     */
    async saveBreakpoint(state) {
        try {
            const stateToSave = {
                ...state,
                timestamp: state.timestamp.toISOString() // 将日期序列化为字符串
            };
            await fs.writeJson(this.breakpointFilePath, stateToSave, { encoding: 'utf-8' });
            console.log(`💾 断点状态已保存: ${state.stage} (${state.progress}%)`);
        }
        catch (error) {
            console.error('❌ 保存断点状态失败:', error);
            this.logError('BREAKPOINT_SAVE_ERROR', error);
        }
    }
    /**
     * 加载断点状态
     * Load checkpoint state from file
     */
    async loadBreakpoint() {
        try {
            if (await fs.pathExists(this.breakpointFilePath)) {
                const stateData = await fs.readJson(this.breakpointFilePath);
                return {
                    ...stateData,
                    timestamp: new Date(stateData.timestamp) // 将字符串反序列化为日期对象
                };
            }
            return null;
        }
        catch (error) {
            console.error('❌ 加载断点状态失败:', error);
            this.logError('BREAKPOINT_LOAD_ERROR', error);
            return null;
        }
    }
    /**
     * 清除断点状态
     * Clear checkpoint state from file
     */
    async clearBreakpoint() {
        try {
            if (await fs.pathExists(this.breakpointFilePath)) {
                await fs.remove(this.breakpointFilePath);
                console.log('🗑️  断点状态已清除');
            }
            // Also clean up the temp directory if it's empty
            const tempDir = path.dirname(this.breakpointFilePath);
            try {
                const dirContents = await fs.readdir(tempDir);
                if (dirContents.length === 0) {
                    await fs.remove(tempDir);
                }
            }
            catch (cleanupError) {
                // If directory isn't empty or other issues, just continue
                console.debug('临时目录清理时遇到问题（通常这没关系）:', cleanupError.message);
            }
        }
        catch (error) {
            console.error('❌ 清除断点状态失败:', error);
            this.logError('BREAKPOINT_CLEAR_ERROR', error);
        }
    }
    /**
     * 获取错误统计
     * Get error statistics
     */
    getErrorStats() {
        const byType = {};
        this.errors.forEach(({ type }) => {
            byType[type] = (byType[type] || 0) + 1;
        });
        return {
            total: this.errors.length,
            byType
        };
    }
    /**
     * 清除错误记录
     * Clear error records
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * 获取所有错误
     * Get all errors
     */
    getAllErrors() {
        return [...this.errors];
    }
    /**
     * 记录错误
     * Log error internally
     */
    logError(type, error) {
        this.errors.push({
            type,
            error,
            timestamp: new Date()
        });
    }
    /**
     * 生成错误报告
     * Generate error report
     */
    generateErrorReport() {
        if (this.errors.length === 0) {
            return '✅ 没有错误记录';
        }
        const stats = this.getErrorStats();
        let report = `\n📊 错误统计:\n`;
        report += `   总计: ${stats.total} 个错误\n`;
        Object.entries(stats.byType).forEach(([type, count]) => {
            report += `   ${type}: ${count} 个\n`;
        });
        report += '\n📝 详细错误:\n';
        this.errors.forEach(({ type, error, timestamp }, index) => {
            report += `   ${index + 1}. [${type}] ${timestamp.toLocaleString()}\n`;
            report += `      ${error.message}\n`;
        });
        return report;
    }
}
exports.GracefulErrorHandler = GracefulErrorHandler;
//# sourceMappingURL=ErrorHandler.js.map