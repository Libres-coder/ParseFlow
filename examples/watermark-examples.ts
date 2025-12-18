/**
 * PDF 水印功能示例
 */

import { PDFUtils } from 'parseflow-core';
import path from 'path';

const pdfUtils = new PDFUtils();

// 示例 1: 添加文字水印
async function addTextWatermark() {
  const result = await pdfUtils.addWatermark(
    'path/to/input.pdf',
    'path/to/output.pdf',
    {
      text: 'CONFIDENTIAL',
      opacity: 0.3,
      fontSize: 48,
      rotation: 45,
      position: 'center',
    }
  );
  console.log(result.message);
}

// 示例 2: 自定义颜色水印
async function addColoredWatermark() {
  await pdfUtils.addWatermark(
    'path/to/input.pdf',
    'path/to/output.pdf',
    {
      text: 'DRAFT',
      opacity: 0.5,
      fontSize: 60,
      rotation: 0,
      color: { r: 1, g: 0, b: 0 }, // 红色
      position: 'bottom-right',
    }
  );
}

// 示例 3: 指定页码添加水印
async function addWatermarkToPages() {
  await pdfUtils.addWatermark(
    'path/to/input.pdf',
    'path/to/output.pdf',
    {
      text: 'INTERNAL',
      pages: [1, 3, 5], // 只在第 1、3、5 页
    }
  );
}

// 示例 4: 添加图片水印
async function addImageWatermark() {
  await pdfUtils.addImageWatermark(
    'path/to/input.pdf',
    'path/to/output.pdf',
    {
      imagePath: 'path/to/logo.png',
      opacity: 0.2,
      position: 'center',
    }
  );
}

export { addTextWatermark, addColoredWatermark, addWatermarkToPages, addImageWatermark };
