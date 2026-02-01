"use strict";
/**
 * 核心数据接口和类型定义
 * Core data interfaces and type definitions for Obsidian Blog Generator
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerationError = exports.ParseError = exports.FileError = exports.ConfigError = void 0;
// 错误类型定义
class ConfigError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
class FileError extends Error {
    constructor(message, filePath) {
        super(message);
        this.filePath = filePath;
        this.name = 'FileError';
    }
}
exports.FileError = FileError;
class ParseError extends Error {
    constructor(message, filePath) {
        super(message);
        this.filePath = filePath;
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
class GenerationError extends Error {
    constructor(message, context) {
        super(message);
        this.context = context;
        this.name = 'GenerationError';
    }
}
exports.GenerationError = GenerationError;
//# sourceMappingURL=index.js.map