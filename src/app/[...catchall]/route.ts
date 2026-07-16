import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const htmlPath = path.join(process.cwd(), 'raw_krisby.html');
  try {
    const html = fs.readFileSync(htmlPath, 'utf8');
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Error loading framer HTML', { status: 500 });
  }
}
