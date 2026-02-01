# 需求文档

## 介绍

Obsidian博客生成器是一个将Obsidian笔记库转换为简约大气个人博客网站的工具。该系统允许用户通过配置文件指定Obsidian vault路径，自动扫描和解析markdown文件，生成包含首页、文章列表和详情页的响应式博客网站，并提供搜索功能。

## 术语表

- **System**: Obsidian博客生成器系统
- **Vault**: Obsidian笔记库，包含用户markdown文件的目录
- **Metadata**: 文章元数据，包括标题、日期、标签等信息
- **Blog_Site**: 生成的博客网站
- **Config_File**: 系统配置文件
- **Scanner**: 文件扫描器组件
- **Generator**: 网站生成器组件
- **Search_Engine**: 搜索功能组件

## 需求

### 需求 1: 配置管理

**用户故事:** 作为博客作者，我希望通过配置文件指定Obsidian vault路径，以便系统能够找到并处理我的笔记文件。

#### 验收标准

1. WHEN 用户创建配置文件 THEN System SHALL 提供标准的配置文件模板
2. WHEN 用户在配置文件中指定vault路径 THEN System SHALL 验证路径的有效性
3. WHEN 配置文件包含无效路径 THEN System SHALL 返回描述性错误信息
4. WHEN 系统启动时 THEN System SHALL 读取并解析配置文件
5. WHERE 配置文件不存在 THEN System SHALL 创建默认配置文件

### 需求 2: 文件扫描和元数据提取

**用户故事:** 作为博客作者，我希望系统能够自动扫描我的Obsidian vault并提取文章元数据，以便生成结构化的博客内容。

#### 验收标准

1. WHEN Scanner 扫描指定路径 THEN System SHALL 识别所有markdown文件
2. WHEN 处理markdown文件时 THEN System SHALL 提取文章标题、日期和标签信息
3. WHEN markdown文件包含frontmatter THEN System SHALL 解析YAML格式的元数据
4. WHEN markdown文件缺少元数据 THEN System SHALL 使用文件名和修改时间作为默认值
5. WHEN 扫描完成后 THEN System SHALL 生成文章索引数据结构

### 需求 3: 博客网站生成

**用户故事:** 作为博客作者，我希望生成一个简约大气的博客网站，包含完整的页面结构，以便访问者能够浏览我的文章。

#### 验收标准

1. WHEN Generator 处理文章数据时 THEN System SHALL 生成静态HTML首页
2. WHEN 生成首页时 THEN System SHALL 显示最新文章列表和网站导航
3. WHEN Generator 创建文章列表页 THEN System SHALL 按日期降序排列所有文章
4. WHEN 生成文章详情页时 THEN System SHALL 将markdown内容转换为HTML格式
5. WHEN 处理文章链接时 THEN System SHALL 保持Obsidian内部链接的功能性
6. WHEN 生成网站时 THEN System SHALL 应用简约大气的CSS样式

### 需求 4: 响应式设计

**用户故事:** 作为博客访问者，我希望在不同设备上都能获得良好的浏览体验，以便随时随地阅读文章。

#### 验收标准

1. WHEN 在桌面设备访问时 THEN Blog_Site SHALL 显示完整的多列布局
2. WHEN 在平板设备访问时 THEN Blog_Site SHALL 调整为适合的两列布局
3. WHEN 在手机设备访问时 THEN Blog_Site SHALL 切换为单列移动布局
4. WHEN 屏幕尺寸改变时 THEN Blog_Site SHALL 动态调整布局和字体大小
5. WHEN 在触摸设备上操作时 THEN Blog_Site SHALL 提供适合触摸的交互元素

### 需求 5: 搜索功能

**用户故事:** 作为博客访问者，我希望能够搜索文章标题和内容，以便快速找到感兴趣的文章。

#### 验收标准

1. WHEN 用户在搜索框输入关键词 THEN Search_Engine SHALL 实时显示匹配结果
2. WHEN 执行搜索时 THEN Search_Engine SHALL 在文章标题和内容中查找匹配项
3. WHEN 显示搜索结果时 THEN Search_Engine SHALL 高亮显示匹配的关键词
4. WHEN 搜索结果为空时 THEN Search_Engine SHALL 显示"未找到相关文章"提示
5. WHEN 用户点击搜索结果时 THEN Search_Engine SHALL 导航到对应的文章详情页

### 需求 6: 文件处理和错误处理

**用户故事:** 作为系统管理员，我希望系统能够优雅地处理各种文件格式和错误情况，以便保证系统的稳定性和可靠性。

#### 验收标准

1. WHEN 遇到损坏的markdown文件时 THEN System SHALL 记录错误并继续处理其他文件
2. WHEN 文件权限不足时 THEN System SHALL 提供清晰的权限错误信息
3. WHEN 磁盘空间不足时 THEN System SHALL 停止生成并报告存储错误
4. WHEN 处理大型文件时 THEN System SHALL 显示处理进度信息
5. IF 生成过程中断 THEN System SHALL 保存已处理的数据并支持断点续传