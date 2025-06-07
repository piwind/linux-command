const path = require('path');
const fs = require('fs-extra');
const { glob } = require('glob');

// 配置项
const config = {
  prodUrl: process.env.PROD_URL || 'https://www.piwind.com/apps/linux-command',
  outputPath: path.join(process.cwd(), '.deploy/sitemap.xml'),
  // 需要包含在 sitemap 中的文件模式
  patterns: [
    'command/**/*.md',  // 命令文档
    'template/**/*.html' // 模板文件
  ],
  // 固定的 URL 列表（会放在最前面）
  fixedUrls: [
    'https://www.piwind.com/apps/linux-command/',
    'https://www.piwind.com/apps/linux-command/hot.html'
  ]
};

// 生成 sitemap XML 内容
function generateSitemapXml(urls) {
  const xmlUrls = urls.map(url => `  <url>
    <loc>${url}</loc>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

// 将文件路径转换为 URL
function filePathToUrl(filePath) {
  // 只处理 .md 文件
  if (filePath.endsWith('.md')) {
    // 获取文件名（不含扩展名）
    const fileName = path.basename(filePath, '.md');
    // 构建新的 URL 格式
    return `${config.prodUrl}/c/${fileName}.html`;
  }
  return null;
}

async function generateSitemap() {
  try {
    console.log('开始生成 sitemap...');
    
    // 确保输出目录存在
    fs.ensureDirSync(path.dirname(config.outputPath));

    // 收集所有需要包含在 sitemap 中的文件
    const allFiles = [];
    for (const pattern of config.patterns) {
      const files = await glob(pattern);
      allFiles.push(...files);
    }

    // 转换为 URL 并过滤掉 null 值
    const urls = allFiles
      .map(filePathToUrl)
      .filter(url => url !== null)
      .sort(); // 按字母顺序排序

    // 将固定 URL 添加到最前面
    const allUrls = [...config.fixedUrls, ...urls];

    // 生成 XML
    const xml = generateSitemapXml(allUrls);

    // 写入文件
    await fs.outputFile(config.outputPath, xml);
    
    console.log(`sitemap.xml 生成成功！共包含 ${allUrls.length} 个 URL`);
    console.log(`文件保存在: ${config.outputPath}`);
  } catch (error) {
    console.error('生成 sitemap 时发生错误:', error);
    process.exit(1);
  }
}

// 执行生成
generateSitemap();
