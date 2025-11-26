/**
 * MCP 客户端使用示例
 * 
 * 演示如何从客户端调用 ParseFlow MCP 服务器
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // 创建 MCP 客户端
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['../../dist/index.js'], // ParseFlow MCP 服务器路径
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
    tools.tools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    // 2. 提取文本
    console.log('\n=== 提取文本 ===');
    const extractResult = await client.callTool({
      name: 'extract_text',
      arguments: {
        path: 'D:/documents/sample.pdf',
        page: 1,
      },
    });
    console.log(extractResult.content[0].text);

    // 3. 搜索内容
    console.log('\n=== 搜索 PDF ===');
    const searchResult = await client.callTool({
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
    const metadataResult = await client.callTool({
      name: 'get_metadata',
      arguments: {
        path: 'D:/documents/sample.pdf',
      },
    });
    console.log(metadataResult.content[0].text);

    // 5. 读取 Resource
    console.log('\n=== 读取 Resource ===');
    const resource = await client.readResource({
      uri: 'pdf://D:/documents/sample.pdf?page=1&format=markdown',
    });
    console.log(resource.contents[0].text);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await transport.close();
    console.log('\nDisconnected');
  }
}

main();
