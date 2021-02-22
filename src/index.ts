import {Command, flags} from '@oclif/command';
import * as inquirer from 'inquirer';
import {AngularProject, NgConfigParser} from './ng-config-parser';
import * as Parser from '@oclif/parser';
import {exec} from 'child_process';
import * as chalk from 'chalk';
import * as figlet from 'figlet';

enum ActionType {
  Serve,
  Test,
  E2E,
  Build
}

interface ResponsePrompt {
  action: ActionType;
  selectedApp: string;
}

class Nglauncher extends Command {
  static description = 'describe the command here'

  static flags: flags.Input<any> = {
    directory: flags.string({char: 'd', description: 'Optional path to angular config file, default to project root'}),
    // // add --version flag to show CLI version
    // version: flags.version({char: 'v'}),
    // help: flags.help({char: 'h'}),
    // // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static args: Parser.args.Input = [];

  private _ngProjects: AngularProject[] = [];

  async run() {
    const {flags} = this.parse(Nglauncher);

    this._displayCliInfo();

    //
    // const name = flags.name ?? 'world';
    // this.log(`hello ${name} from .\\src\\index.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }

    const parser = new NgConfigParser();
    this._ngProjects = parser.parse(flags.directory);

    const actionChoice = await inquirer.prompt<ResponsePrompt>([
      {
        name: 'action',
        message: 'select an action',
        type: 'list',
        choices: [
          {name: 'serve', value: ActionType.Serve},
          {name: 'test', value: ActionType.Test},
          {name: 'e2e', value: ActionType.E2E},
          {name: 'build', value: ActionType.Build},
        ],
      },
      {
        name: 'selectedApp',
        message: 'Select an app',
        type: 'list',
        choices: this._ngProjects.map(p => p.name),
      },
    ]);

    switch (actionChoice.action) {
    case ActionType.Serve:
      this._processServe(actionChoice.selectedApp);
      break;
    case ActionType.Test:
      this._processTest(actionChoice.selectedApp);
      break;
    case ActionType.E2E:
      this._processE2e(actionChoice.selectedApp);
      break;
    case ActionType.Build:
      this._processBuild(actionChoice.selectedApp);
      break;
    }
  }

  private _processServe(appName: string) {
    this.log(`Starting ${appName} app`);
    exec(`npm run ng -- serve ${appName}`);
  }

  private _processTest(appName: string) {
    exec(`npm run ng -- test ${appName}`);
  }

  private _processE2e(appName: string) {
    exec(`npm run ng -- e2e ${appName}-e2e`);
  }

  private _processBuild(appName: string) {
    exec(`npm run ng -- build ${appName}`);
  }

  private _displayCliInfo() {
    this.log(chalk.yellow(
      figlet.textSync('Angular Launcher', {horizontalLayout: 'default'})
    ));
  }
}

export = Nglauncher
