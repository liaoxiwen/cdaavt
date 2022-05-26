import { readdirSync } from 'fs';
import { join } from 'path';
import { isDirectory, isFileExists, readJson } from '../utils/common';
import { IPathConfig } from '../utils/type';

function readProjectConfig() {
	let configPath;
	const jsconfigPath = 'jsconfig.json';
	const tsconfigPath = 'tsconfig.json';
	if (isFileExists(jsconfigPath)) {
		configPath = jsconfigPath;
	}
	if (isFileExists(tsconfigPath)) {
		configPath = tsconfigPath;
	}
	return configPath ? (readJson(configPath) as any) : {};
}

function getFilesPath(include: string[], exclude: string[]): string[] {
	const currentPath = process.cwd();
	const includeDirPaths: string[] = include.map(path => join(currentPath, path));
	const exlcudeDirPaths: string[] = exclude.map(path => join(currentPath, path));
	const directorys: string[] = includeDirPaths;
	const files: string[] = [];
	for (let i = 0; i < directorys.length; i++) {
		if (isFileExists(directorys[i])) {
			if (isDirectory(directorys[i])) {
				const dirs = readdirSync(directorys[i]);
				dirs.forEach(dir => {
					const newPath = join(directorys[i], dir);
					if (exlcudeDirPaths.indexOf(newPath) === -1) {
						isDirectory(newPath) ? directorys.push(newPath) : files.push(newPath);
					}
				});
			} else {
				files.push(directorys[i]);
			}
		}
	}
	return files.map(file => file.replace(/\\/g, '/'));
}

function classifyFiles(files: string[]) {
	const tsJsReg = /(\.ts)|(\.tsx)|(\.js)|(\.jsx)/;
	const tsJsFiles: string[] = [];
	const otherFiles: string[] = [];
	files.forEach(file => {
		if (tsJsReg.test(file)) {
			tsJsFiles.push(file);
		} else {
			otherFiles.push(file);
		}
	});
	return {
		tsJsFiles,
		otherFiles,
	};
}

function dealWildCard(paths: IPathConfig, baseUrl: string): IPathConfig {
	const dealedPaths: IPathConfig = {};
	const wildCardReg = /\*+/;
	Object.keys(paths).forEach(key => {
		const dealedKey = key.replace(wildCardReg, '');
		dealedPaths[dealedKey] = paths[key].map(item => {
			const absolutePath = join(process.cwd(), baseUrl, item);
			return absolutePath.replace(wildCardReg, '');
		});
	});
	return dealedPaths;
}

export default function() {
	const config = readProjectConfig();
	const baseUrl = config.compilerOptions?.baseUrl ?? '.';
	const includeConfig = ((config.include as string[]) ?? ['']).map(item => item.replace(/(\/\**\/\*)|(\/\*)/g, ''));
	const excludeConfig = ((config.exclude as string[]) ?? []).map(item => item.replace(/(\/\**\/\*)|(\/\*)/g, ''));
	const pathConfig = dealWildCard(config.compilerOptions?.paths ?? {}, baseUrl);
	const files = getFilesPath(includeConfig, excludeConfig);
	const classifiedFiles = classifyFiles(files);
	return {
		pathConfig,
		files,
		tsJsFiles: classifiedFiles.tsJsFiles,
		otherFiles: classifiedFiles.otherFiles,
	};
}
