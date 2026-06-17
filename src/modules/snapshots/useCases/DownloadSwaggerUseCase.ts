export class DownloadSwaggerUseCase {
  async execute(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch Swagger from ' + url);
    }
    return await response.json();
  }
}
