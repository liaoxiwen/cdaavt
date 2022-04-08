import { join } from "path";
import { IPathConfig, SUFFIX } from "./type";
import { isFileExists } from './common';

function suffixMatch(path: string): string {
    if (isFileExists(`${path}${SUFFIX.JS}`)) {
        return `${path}${SUFFIX.JS}`;
    }
    if (isFileExists(`${path}${SUFFIX.JSX}`)) {
        return `${path}${SUFFIX.JSX}`;
    }
    if (isFileExists(`${path}${SUFFIX.TS}`)) {
        return `${path}${SUFFIX.TS}`;
    }
    if (isFileExists(`${path}${SUFFIX.TSX}`)) {
        return `${path}${SUFFIX.TSX}`;
    }
    if (isFileExists(join(path, SUFFIX.INDEXJS))) {
        return join(path, SUFFIX.INDEXJS);
    }
    if (isFileExists(join(path, SUFFIX.INDEXJSX))) {
        return join(path, SUFFIX.INDEXJSX);
    }
    if (isFileExists(join(path, SUFFIX.INDEXTS))) {
        return join(path, SUFFIX.INDEXTS);
    }
    if (isFileExists(join(path, SUFFIX.INDEXTSX))) {
        return join(path, SUFFIX.INDEXTSX);
    }
    if (isFileExists(path)) {
        return path;
    }
    return path;
}

export function dependencyFileAbslutePathAnalysis(modulePath: string, dependencyRelativePath: string, paths: IPathConfig) {
    const currentDirPathReg = /\.{1}\//g;
    const upperLevelDirPathReg = /\.{2}\//g;
    let realDependencyPath = dependencyRelativePath;

    // 路径映射处理
    for (const key in paths) {
        const reg = new RegExp(key);
        if (reg.test(dependencyRelativePath)) {
            realDependencyPath = join(paths[key][0], dependencyRelativePath.replace(reg, ''));
            return suffixMatch(realDependencyPath);
        }
    }
    // 先判断 ../ 后判断 ./
    if (upperLevelDirPathReg.test(dependencyRelativePath)) {
        const splitRes = modulePath.split('/');
        const regMatchRes = dependencyRelativePath.match(upperLevelDirPathReg);
        const backNum = regMatchRes ? regMatchRes.length : 0;
        const dealedModule = splitRes.slice(0, splitRes.length - backNum - 1).join('/');
        const dealedDependencyRelativePath = dependencyRelativePath.replace(upperLevelDirPathReg, '')
        realDependencyPath = join(dealedModule, dealedDependencyRelativePath);
        return suffixMatch(realDependencyPath);
    }
    if (currentDirPathReg.test(dependencyRelativePath)) {
        const splitRes = modulePath.split('/');
        const dealedModule = splitRes.slice(0, splitRes.length - 1).join('/');
        realDependencyPath = join(dealedModule, dependencyRelativePath);
        return suffixMatch(realDependencyPath);
    }
    realDependencyPath = realDependencyPath;
    return realDependencyPath;
}