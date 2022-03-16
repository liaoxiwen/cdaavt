import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { isFileExists, readJson } from '../utils/common';

function getFilesPath(currentPath: string, paths: string[]): string[] {
    const dirPaths: string[] = paths.map(path => join(currentPath, path));
    const directorys: string[] = dirPaths;
    const files: string[] = [];
    for (let i = 0; i < directorys.length; i++) {
        if (isFileExists(directorys[i])) {
            const readRes = readdirSync(directorys[i]);
            readRes.forEach(r => {
                const newPath = join(directorys[i], r);
                const stat = statSync(newPath);
                if (stat.isDirectory()) {
                    directorys.push(newPath);
                } else {
                    files.push(newPath);
                }
            });
        }
    }
    return files;
}

function getIncludeConfig() {
    let configPath;
    const jsconfigPath = 'jsconfig.json';
    const tsconfigPath = 'tsconfig.json';
    if (isFileExists(jsconfigPath)) {
        configPath = jsconfigPath;
    }
    if (isFileExists(tsconfigPath)) {
        configPath = tsconfigPath;
    }
    if (!configPath) {
        return [''];
    } else {
        const config: any = readJson(configPath);
        return config.include || [''];
    }
}

export default function depAnalysis() {
    const currentPath = process.cwd();
    const include = getIncludeConfig();
    const files = getFilesPath(currentPath, include);
    console.log(files);
}
