#!/usr/bin/env node
"use strict";
/**
 * 命令行接口
 * Command Line Interface for Obsidian Blog Generator
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
const commander_1 = require("commander");
const index_1 = require("./index");
const path = __importStar(require("path"));
const program = new commander_1.Command();
program
    .name('obsidian-blog')
    .description('将Obsidian笔记库转换为简约大气个人博客网站')
    .version('1.0.0');
program
    .command('generate')
    .alias('gen')
    .description('生成博客网站')
    .option('-c, --config <path>', '配置文件路径')
    .option('-v, --verbose', '显示详细输出')
    .option('--resume', '从断点恢复生成过程')
    .action(async (options) => {
    try {
        const generator = new index_1.ObsidianBlogGenerator();
        const configPath = options.config ? path.resolve(options.config) : undefined;
        const resume = options.resume || false;
        if (options.verbose) {
            console.log('🔧 详细模式已启用');
            if (configPath) {
                console.log(`📋 使用配置文件: ${configPath}`);
            }
            if (resume) {
                console.log('🔄 启用断点恢复模式');
            }
        }
        const success = await generator.generate(configPath, resume);
        if (success) {
            console.log('🎉 博客生成任务已完成！');
        }
        else {
            console.log('⚠️  博客生成任务部分完成或遇到问题');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('生成失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program
    .command('init')
    .description('初始化配置文件')
    .option('-o, --output <path>', '配置文件输出路径', './blog.config.json')
    .action(async (options) => {
    try {
        const { ConfigManager } = await Promise.resolve().then(() => __importStar(require('./core/ConfigManager')));
        const configManager = new ConfigManager();
        const defaultConfig = configManager.createDefaultConfig();
        await configManager.saveConfig(defaultConfig, options.output);
        console.log(`✅ 配置文件已创建: ${options.output}`);
        console.log('请编辑配置文件后运行 obsidian-blog generate');
    }
    catch (error) {
        console.error('初始化失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
program
    .command('validate')
    .description('验证配置文件')
    .option('-c, --config <path>', '配置文件路径')
    .action(async (options) => {
    try {
        const { ConfigManager } = await Promise.resolve().then(() => __importStar(require('./core/ConfigManager')));
        const configManager = new ConfigManager();
        const config = await configManager.loadConfig(options.config);
        const validation = configManager.validateConfig(config);
        if (validation.isValid) {
            console.log('✅ 配置文件有效');
        }
        else {
            console.log('❌ 配置文件无效:');
            validation.errors.forEach(error => console.log(`   - ${error}`));
        }
        if (validation.warnings.length > 0) {
            console.log('⚠️  警告:');
            validation.warnings.forEach(warning => console.log(`   - ${warning}`));
        }
    }
    catch (error) {
        console.error('验证失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
});
// 如果没有提供命令，显示帮助
if (process.argv.length <= 2) {
    program.help();
}
program.parse(process.argv);
//# sourceMappingURL=cli.js.map