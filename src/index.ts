import { Command } from 'commander';
// import depAnalysis from './dependency-analyz/index';
import createReport from './visualization/html';
import { initConfig } from './init';

const program = new Command();
program
  .option('-h, --help', 'Print this help')
  .option('-r, --run', 'Run this tool')
  .option('-i, --init', 'Init project');

program.parse(process.argv);
const options = program.opts();
if (options.help) {
  console.log('Help');
}
if (options.init) {
  initConfig();
}
if (options.run) {
  // depAnalysis();
  createReport();
}


