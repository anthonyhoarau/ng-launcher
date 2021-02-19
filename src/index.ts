import {Command, flags} from '@oclif/command';
import {AngularProject, NgConfigParser} from './ng-config-parser';

class Nglauncher extends Command {
  static description = 'describe the command here'

  static flags = {
    dir: flags.string({char: 'n', description: 'directory to angular config file'}),
    // // add --version flag to show CLI version
    // version: flags.version({char: 'v'}),
    // help: flags.help({char: 'h'}),
    // // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Nglauncher);
    //
    // const name = flags.name ?? 'world';
    // this.log(`hello ${name} from .\\src\\index.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }

    const parser = new NgConfigParser();


    const ngProjects: AngularProject[] = parser.parse(flags.dir);
    console.log(ngProjects);
  }
}

export = Nglauncher
