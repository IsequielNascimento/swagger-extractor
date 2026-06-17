import { config } from 'dotenv';
import { DownloadSwaggerUseCase } from '../src/modules/snapshots/useCases/DownloadSwaggerUseCase';
import { SaveSnapshotUseCase } from '../src/modules/snapshots/useCases/SaveSnapshotUseCase';

// Carrega as variáveis do .env local
config({ path: '.env' });
config({ path: '.env.local', override: true });

async function main() {
  console.log('🔄 Iniciando sincronização manual de snapshots...');

  let targets: { url: string; name: string }[] = [];
  try {
    targets = JSON.parse(process.env.API_TARGETS || '[]');
  } catch (e) {
    console.error('❌ Erro: Formato inválido na variável API_TARGETS no .env');
    process.exit(1);
  }

  if (targets.length === 0) {
    console.error('❌ Erro: Nenhum target de API configurado na variável API_TARGETS');
    process.exit(1);
  }

  try {
    const downloader = new DownloadSwaggerUseCase();
    const saver = new SaveSnapshotUseCase();

    for (const target of targets) {
      console.log(`\nBaixando snapshot para: ${target.name} (${target.url})`);
      try {
        const swaggerJson = await downloader.execute(target.url);
        const result = await saver.execute(target.name, swaggerJson);
        console.log(`✅ Snapshot '${target.name}' salvo com sucesso. ID: ${result.id}`);
      } catch (err: any) {
         console.error(`❌ Falha ao processar '${target.name}': ${err.message}`);
      }
    }

    console.log('\n✨ Sincronização finalizada!');
  } catch (error: any) {
    console.error(`\n❌ Erro crítico: ${error.message}`);
    process.exit(1);
  }
}

main();
