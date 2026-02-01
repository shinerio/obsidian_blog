/**
 * 配置管理器
 * Configuration Manager for handling blog configuration
 */
import { BlogConfig, ValidationResult } from '../types';
export declare class ConfigManager {
    private static readonly DEFAULT_CONFIG_NAME;
    /**
     * 加载配置文件
     * Load configuration from file
     */
    loadConfig(configPath?: string): Promise<BlogConfig>;
    /**
     * 验证配置
     * Validate configuration
     */
    validateConfig(config: BlogConfig): ValidationResult;
    /**
     * 创建默认配置
     * Create default configuration
     */
    createDefaultConfig(): BlogConfig;
    /**
     * 验证路径是否有效
     * Validate if a path is valid and accessible
     */
    validatePath(pathToValidate: string, type?: 'read' | 'write'): {
        isValid: boolean;
        error?: string;
    };
    /**
     * 保存配置文件
     * Save configuration to file
     */
    saveConfig(config: BlogConfig, configPath?: string): Promise<void>;
    /**
     * 获取默认配置文件路径
     * Get default configuration file path
     */
    private getDefaultConfigPath;
}
//# sourceMappingURL=ConfigManager.d.ts.map