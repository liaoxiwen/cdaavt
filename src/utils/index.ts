import { getCompilerOptionsFromTsConfig } from "ts-morph";
import resolve from 'enhanced-resolve';

export function getFileAbsolutePath(path: string, relativePath: string): string {
    const atReg = /(\@\/)/;
    const curDicReg = /(\.\/)/;
    const preDicReg = /(\.\.\/)/;
    if(atReg.test(relativePath)) {
        console.log(getCompilerOptionsFromTsConfig(''))
    }
    return '';
}