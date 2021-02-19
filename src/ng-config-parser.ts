import {readFileSync} from 'fs';
import {findWorkspaceRoot} from './workspace-root';

export interface AngularProject {
  type: 'application' | 'library';
  name: string;
}

interface AngularConfig {
  projects: {
    [key: string]: {
      projectType: 'application' | 'library';
    }
  }
}

export class NgConfigParser {

  /**
   * Search for angular config file and return all apps
   * @param dir Optional dir, default to root dir.
   */
  parse(dir?: string): AngularProject[] {
    const projectDir = dir ? dir : process.cwd();
    const workspace = findWorkspaceRoot(projectDir);
    if (!workspace || workspace.type !== "angular") {
      throw new Error("Angular Workspace not found!");
    }

    const file = readFileSync(workspace.dir, {encoding: 'utf-8'});
    const jsonConfig = JSON.parse(file) as AngularConfig;

    if(!jsonConfig || !jsonConfig.projects) {
      throw new Error("Missing projects entry in angular.json");
    }

    const projects: AngularProject[] = [];
    for (let project of Object.keys(jsonConfig.projects)) {
      projects.push({name: project, type: jsonConfig.projects[project].projectType});
    }

    return projects;
  }
}
