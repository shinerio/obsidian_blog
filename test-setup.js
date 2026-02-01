"use strict";
/**
 * Jest测试环境设置
 * Jest test environment setup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestMarkdownFile = exports.cleanupTempDir = exports.createTempDir = void 0;
// 设置测试超时时间
jest.setTimeout(10000);
// 模拟console方法以避免测试输出污染
const originalConsole = { ...console };
beforeEach(() => {
    // 在每个测试前重置console mock
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
});
afterEach(() => {
    // 在每个测试后恢复console
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
});
// 自定义匹配器
expect.extend({
    toBeValidPath(received) {
        const pass = typeof received === 'string' && received.length > 0;
        return {
            message: () => `expected ${received} to be a valid path`,
            pass,
        };
    },
    toBeMarkdownFile(received) {
        const pass = received.endsWith('.md') || received.endsWith('.markdown');
        return {
            message: () => `expected ${received} to be a markdown file`,
            pass,
        };
    },
});
// 导出测试工具函数
const createTempDir = async () => {
    const fs = require('fs-extra');
    const path = require('path');
    const os = require('os');
    const tempDir = path.join(os.tmpdir(), `obsidian-blog-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    return tempDir;
};
exports.createTempDir = createTempDir;
const cleanupTempDir = async (tempDir) => {
    const fs = require('fs-extra');
    await fs.remove(tempDir);
};
exports.cleanupTempDir = cleanupTempDir;
const createTestMarkdownFile = async (filePath, content, frontmatter) => {
    const fs = require('fs-extra');
    const path = require('path');
    await fs.ensureDir(path.dirname(filePath));
    let fileContent = '';
    if (frontmatter) {
        fileContent += '---\n';
        Object.entries(frontmatter).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                fileContent += `${key}:\n${value.map(v => `  - ${v}`).join('\n')}\n`;
            }
            else {
                fileContent += `${key}: ${value}\n`;
            }
        });
        fileContent += '---\n\n';
    }
    fileContent += content;
    await fs.writeFile(filePath, fileContent);
};
exports.createTestMarkdownFile = createTestMarkdownFile;
//# sourceMappingURL=test-setup.js.map