export class DownloadSwaggerUseCase {
  async execute(url: string): Promise<unknown> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger from ${url} — status ${response.status}`);
    }
    return response.json();
  }
}
