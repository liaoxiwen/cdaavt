import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { isFileExists, readJson } from '../utils/common';
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
    return configPath ? readJson(configPath) as any : null;
}

function getFilesPath(include: string[], exclude: string[]): string[] {
    const currentPath = process.cwd();
    const includeDirPaths: string[] = include.map(path => join(currentPath, path));
    const exlcudeDirPaths: string[] = exclude.map(path => join(currentPath, path));

    const directorys: string[] = includeDirPaths;
    const files: string[] = [];

    for (let i = 0; i < directorys.length; i++) {
        if (isFileExists(directorys[i])) {
            const readRes = readdirSync(directorys[i]);
            readRes.forEach(r => {
                const newPath = join(directorys[i], r);
                const stat = statSync(newPath);
                if (stat.isDirectory() && exlcudeDirPaths.indexOf(newPath) === -1) {
                    directorys.push(newPath);
                } else {
                    files.push(newPath);
                }
            });
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
        otherFiles
    }
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

export default function () {
    const config = readProjectConfig();
    const baseUrl = config.compilerOptions.baseUrl ?? '.';
    const pathConfig = dealWildCard(config.compilerOptions.paths ?? {}, baseUrl);
    const includeConfig = config.include ?? [''];
    const excludeConfig = config.exclude ?? [];
    const files = getFilesPath(includeConfig, excludeConfig);
    const classifiedFiles = classifyFiles(files);
    return {
        pathConfig,
        files,
        tsJsFiles: classifiedFiles.tsJsFiles,
        otherFiles: classifiedFiles.otherFiles
    };
}
