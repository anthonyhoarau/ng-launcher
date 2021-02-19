import {existsSync} from 'fs';
import * as path from 'path';

export interface Workspace {
  type: 'angular';
  dir: string;
}

/**
 * Recursively walks back up the directory to try to find a workspace file (angular.json, etc.)
 * @param dir Directory to start searching with
 */
export function findWorkspaceRoot(dir: string): Workspace | null {
  if (path.dirname(dir) === dir) {
    return null;
  }

  if (existsSync(path.join(dir, 'angular.json'))) {
    return { type: 'angular', dir: path.join(dir, 'angular.json') };
  }

  return findWorkspaceRoot(path.dirname(dir));
}
