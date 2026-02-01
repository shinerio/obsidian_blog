/**
 * Jest测试环境设置
 * Jest test environment setup
 */
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidPath(): R;
            toBeMarkdownFile(): R;
        }
    }
}
export declare const createTempDir: () => Promise<string>;
export declare const cleanupTempDir: (tempDir: string) => Promise<void>;
export declare const createTestMarkdownFile: (filePath: string, content: string, frontmatter?: any) => Promise<void>;
//# sourceMappingURL=test-setup.d.ts.map