import {spawn} from 'child_process';

interface LaunchCallback {
  stdout?: (out: string) => void | null;
  stderr?: (out: string) => void | null;
  error?: (code?: number | null, message?: string | null) => void | null;
  exit?: (code: number | null) => void | null;
}

export class ProcessLauncher {
  static launch(command: string, args: string[] = [], callback?: LaunchCallback): void {
    const child = spawn(command, args, {shell: process.platform === 'win32'});
    child.stdout.on('data', (chunk) => {
      if (callback && callback.stdout) {
        callback.stdout(`${chunk}`);
      }
    });
    child.stderr.on('data', (chunk) => {
      if (callback && callback.stderr) {
        callback.stderr(`${chunk}`);
      }
    });
    child.on('error', (err) => {
      if (callback && callback.error) {
        callback.error(null, err.message);
      }
    });
    child.on('exit', (code) => {
      if (callback && callback.exit) {
        callback.exit(code);
      }
    });
  }
}
