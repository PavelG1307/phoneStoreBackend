import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class AdminService {
  constructor(private readonly productService: ProductService) {}

  private dumpInProgress = false;

  async dumpProdToDev(): Promise<{ ok: boolean; message: string; stdout?: string; stderr?: string }> {
    if (this.dumpInProgress) {
      throw new ServiceUnavailableException('Дамп уже выполняется.');
    }

    // Путь к скрипту: из dist/admin/ поднимаемся в корень проекта (не зависим от process.cwd())
    const projectRoot = path.join(__dirname, '..', '..');
    const defaultScriptPath = path.join(projectRoot, 'scripts', 'dump-prod-to-dev.sh');
    const scriptPath = process.env.DUMP_SCRIPT_PATH || defaultScriptPath;
    const root = process.env.DUMP_CWD || projectRoot;

    this.dumpInProgress = true;

    return new Promise((resolve, reject) => {
      const child = spawn('bash', [scriptPath], {
        cwd: root,
        env: process.env,
      });

      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (chunk) => (stdout += chunk.toString()));
      child.stderr?.on('data', (chunk) => (stderr += chunk.toString()));

      child.on('close', (code) => {
        this.dumpInProgress = false;
        if (code === 0) {
          resolve({ ok: true, message: 'Дамп выполнен.', stdout, stderr });
        } else {
          resolve({
            ok: false,
            message: `Скрипт завершился с кодом ${code}.`,
            stdout,
            stderr,
          });
        }
      });

      child.on('error', (err) => {
        this.dumpInProgress = false;
        reject(new ServiceUnavailableException(`Запуск скрипта: ${err.message}`));
      });
    });
  }

  async backfillProductSlugs(): Promise<{ updated: number }> {
    return this.productService.backfillSlugs();
  }
}
