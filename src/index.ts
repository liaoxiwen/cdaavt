import { Command } from 'commander';
import main from './main';

const program = new Command();
program
	.name('cdaavt')
	.description('Component dependency analysis and visualization tool')
	.version(`${require('../package.json').version}`, '-v, --version.', "Cdaavt's version.");

program
	.option('-r, --run', 'Run this tool.')
	.option('-o, --output <filename>', 'Output result.')
	.option('-f, --format <format>', "Result format, includes 'json' and 'html'.")
	.option('-p, --path <path>', 'Impact Scope Analysis.')
	.action(options => {
		main(options);
	});

program.parse(process.argv);
