import { Command } from 'commander';
import main from './main';

const program = new Command();
program
  .version(`${require('../package.json').version}`, '-v --version')
  .usage('[options]')
  .command('cdaavt [options]')
  .description('Use this tool => cdaavt -r');

program
  .option('-r, --run', 'Run this tool')
  .action((options) => {
    if (options.run) {
      main();
    }
  });

program.parse(process.argv);


