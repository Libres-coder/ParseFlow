/**
 * MCP 客户端使用示例
 * 
 * 演示如何从客户端调用 ParseFlow MCP 服务器
 * 
 * 注意：需要安装 @modelcontextprotocol/sdk
 * npm install @modelcontextprotocol/sdk
 */

// 注意：这些导入需要先安装 MCP SDK
// import { Client } from '@modelcontextprotocol/sdk/client/index.js';
// import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * MCP 工具调用结果接口
 */
interface ToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * MCP 工具定义接口
 */
interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

/**
 * 主函数：演示 MCP 客户端调用
 */
async function main(): Promise<void> {
  /**
   * ⚠️ 取消注释以下代码前，请先安装依赖：
   * npm install @modelcontextprotocol/sdk
   */
  
  /*
  // 创建 MCP 客户端
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['../packages/mcp-server/dist/index.js'], // ParseFlow MCP 服务器路径
  });

  const client = new Client(
    {
      name: 'parseflow-client-example',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  console.log('Connected to ParseFlow MCP Server');

  try {
    // 1. 列出可用工具
    console.log('\n=== 可用工具 ===');
    const tools = await client.listTools();
    tools.tools.forEach((tool: Tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    // 2. 提取文本
    console.log('\n=== 提取文本 ===');
    const extractResult: ToolResult = await client.callTool({
      name: 'extract_text',
      arguments: {
        path: 'D:/documents/sample.pdf',
        page: 1,
      },
    });
    console.log(extractResult.content[0].text);

    // 3. 搜索内容
    console.log('\n=== 搜索 PDF ===');
    const searchResult: ToolResult = await client.callTool({
      name: 'search_pdf',
      arguments: {
        path: 'D:/documents/sample.pdf',
        query: 'revenue',
        maxResults: 3,
      },
    });
    console.log(searchResult.content[0].text);

    // 4. 获取元数据
    console.log('\n=== PDF 元数据 ===');
    const metadataResult: ToolResult = await client.callTool({
      name: 'get_metadata',
      arguments: {
        path: 'D:/documents/sample.pdf',
      },
    });
    console.log(metadataResult.content[0].text);

    // 5. 读取 Resource
    console.log('\n=== 读取 Resource ===');
    const resource = await client.readResource({
      uri: 'pdf://D:/documents/sample.pdf?page=1',
    });
    console.log(resource.contents[0].text);

  } catch (error: unknown) {
    console.error('Error:', error);
  } finally {
    await transport.close();
    console.log('\nDisconnected');
  }
  */

  console.log('⚠️ 此示例需要安装 @modelcontextprotocol/sdk');
  console.log('请取消注释代码并安装依赖后运行。');
  console.log('\n安装命令:');
  console.log('npm install @modelcontextprotocol/sdk');
}

// 运行示例
main();
