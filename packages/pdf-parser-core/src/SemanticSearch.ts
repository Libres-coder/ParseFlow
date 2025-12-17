/**
 * 语义搜索类 - 基于向量嵌入的文档搜索
 */

import { pipeline } from '@xenova/transformers';

export interface SemanticSearchOptions {
  model?: string;
  topK?: number;
  minScore?: number;
}

export interface SemanticSearchResult {
  text: string;
  score: number;
  index: number;
}

export interface DocumentChunk {
  text: string;
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmbedderPipeline = any;

export class SemanticSearch {
  private embedder: EmbedderPipeline | null = null;
  private modelName: string;
  private chunks: DocumentChunk[] = [];

  constructor(modelName: string = 'Xenova/all-MiniLM-L6-v2') {
    this.modelName = modelName;
  }

  /**
   * 初始化嵌入模型
   */
  private async getEmbedder(): Promise<EmbedderPipeline> {
    if (!this.embedder) {
      this.embedder = await pipeline('feature-extraction', this.modelName);
    }
    return this.embedder;
  }

  /**
   * 生成文本的向量嵌入
   */
  async embed(text: string): Promise<number[]> {
    const embedder = await this.getEmbedder();
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data as Float32Array);
  }

  /**
   * 将文档分割成块并索引
   */
  async indexDocument(text: string, chunkSize: number = 500, overlap: number = 50): Promise<number> {
    const chunks = this.splitIntoChunks(text, chunkSize, overlap);
    
    for (const chunkText of chunks) {
      const embedding = await this.embed(chunkText);
      this.chunks.push({ text: chunkText, embedding });
    }

    return this.chunks.length;
  }

  /**
   * 添加预处理的块
   */
  async addChunk(text: string, metadata?: Record<string, unknown>): Promise<void> {
    const embedding = await this.embed(text);
    this.chunks.push({ text, embedding, metadata });
  }

  /**
   * 语义搜索
   */
  async search(query: string, options: SemanticSearchOptions = {}): Promise<SemanticSearchResult[]> {
    const { topK = 5, minScore = 0.3 } = options;

    if (this.chunks.length === 0) {
      return [];
    }

    const queryEmbedding = await this.embed(query);

    // 计算余弦相似度
    const results: SemanticSearchResult[] = this.chunks
      .map((chunk, index) => ({
        text: chunk.text,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding!),
        index,
      }))
      .filter((result) => result.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * 将文本分割成块
   */
  private splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        // 保留重叠部分
        const words = currentChunk.split(' ');
        const overlapWords = Math.floor(overlap / 5); // 假设平均单词长度为 5
        currentChunk = words.slice(-overlapWords).join(' ') + ' ';
      }
      currentChunk += sentence + ' ';
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * 清空索引
   */
  clear(): void {
    this.chunks = [];
  }

  /**
   * 获取索引块数量
   */
  getChunkCount(): number {
    return this.chunks.length;
  }

  /**
   * 释放资源
   */
  async dispose(): Promise<void> {
    this.embedder = null;
    this.chunks = [];
  }
}
