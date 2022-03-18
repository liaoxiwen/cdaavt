import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { isFileExists, readJson } from '../utils/common';

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
    return configPath ? readJson(configPath) as any : null;
}

function getFilesPath(paths: string[]): string[] {
    const currentPath = process.cwd();
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
        otherFiles
    }
}

export default function () {
    const config = readProjectConfig();
    const pathConfig = config.compilerOptions.paths ?? {};
    const includeConfig = config.include ?? [''];
    const files = getFilesPath(includeConfig);
    const classifiedFiles = classifyFiles(files);
    return {
        pathConfig,
        files,
        tsJsFiles: classifiedFiles.tsJsFiles,
        otherFiles: classifiedFiles.otherFiles
    };
}
