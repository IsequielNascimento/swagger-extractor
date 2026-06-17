import { NextResponse } from 'next/server';
import { DownloadSwaggerUseCase } from '@/modules/snapshots/useCases/DownloadSwaggerUseCase';
import { SaveSnapshotUseCase } from '@/modules/snapshots/useCases/SaveSnapshotUseCase';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const targetUrl = process.env.TARGET_SWAGGER_URL;
  const apiName = process.env.TARGET_API_NAME || 'default-api';

  if (!targetUrl) {
    return NextResponse.json({ error: 'TARGET_SWAGGER_URL not configured' }, { status: 500 });
  }

  try {
    const downloader = new DownloadSwaggerUseCase();
    const swaggerJson = await downloader.execute(targetUrl);

    const saver = new SaveSnapshotUseCase();
    const result = await saver.execute(apiName, swaggerJson);

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
