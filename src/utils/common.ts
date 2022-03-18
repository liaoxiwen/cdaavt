import { readFileSync, writeFileSync, existsSync } from 'fs';
import { IPathConfig } from './type';

export function writeJson<T>(fileName: string, content: T): void {
    writeFileSync(fileName, JSON.stringify(content, null, 2));
}

export function writeHtml(filName: string, content: string): void {
    writeFileSync(filName, content);
}

export function readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, { encoding: 'utf-8', flag: 'r' }));
}

export function isFileExists(path: string): boolean {
    return existsSync(path);
}

export function dependencyFileAbslutePathAnalysis(modulePath: string, dependencyRelativePath: string, config: IPathConfig) {
    const currentDirPathReg = /\.{1}\//;
    const upperLevelDirPathReg = /\.{2}\//;
    let realDependencyPath = dependencyRelativePath;
    for(const key in config) {
        const keyReg = new RegExp(key);
        if(keyReg.test(dependencyRelativePath)) {
            
            return realDependencyPath;
        }
    }
    // 先判断 ../ 后判断 ./
    if(upperLevelDirPathReg.test(dependencyRelativePath)) {
        return realDependencyPath;
    }
    if(currentDirPathReg.test(dependencyRelativePath)) {
        return realDependencyPath;
    }
    return realDependencyPath;
}