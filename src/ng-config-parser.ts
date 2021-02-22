import {readFileSync} from 'fs';
import {findWorkspaceRoot} from './workspace-root';
import {CLIError} from '@oclif/errors';

export enum AngularProjectType {
  Application = 'application',
  Library = 'library',
}

export interface AngularProject {
  type: AngularProjectType;
  name: string;
}

interface AngularConfig {
  projects: {
    [key: string]: {
      projectType: 'application' | 'library';
    };
  };
}

export class NgConfigParser {
  /**
   * Search for angular config file and return all apps
   * @param {string} dir Optional dir, default to root dir.
   * @return {AngularProject} Angular Project list
   */
  parse(dir?: string): AngularProject[] {
    const projectDir = dir ? dir : process.cwd();
    const workspace = findWorkspaceRoot(projectDir);
    if (!workspace || workspace.type !== 'angular') {
      throw new CLIError('Angular Workspace not found!');
    }

    const file = readFileSync(workspace.dir, {encoding: 'utf-8'});
    const jsonConfig = JSON.parse(file) as AngularConfig;

    if (!jsonConfig || !jsonConfig.projects) {
      throw new CLIError('Missing projects entry in angular.json');
    }

    const projects: AngularProject[] = [];
    for (const project of Object.keys(jsonConfig.projects)) {
      const type = jsonConfig.projects[project].projectType === 'application' ? AngularProjectType.Application : AngularProjectType.Library;
      projects.push({name: project, type});
    }

    return projects;
  }
}
