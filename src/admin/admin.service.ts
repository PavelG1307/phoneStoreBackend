import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class AdminService {
  private dumpInProgress = false;

  async dumpProdToDev(): Promise<{ ok: boolean; message: string; stdout?: string; stderr?: string }> {
    if (this.dumpInProgress) {
      throw new ServiceUnavailableException('Дамп уже выполняется.');
    }

    const root = process.cwd();
    this.dumpInProgress = true;
    const scriptPath = path.join(root, 'scripts', 'dump-prod-to-dev.sh');

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
}
