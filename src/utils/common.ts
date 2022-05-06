import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';

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

export function isDirectory(path: string): boolean {
    const stat = statSync(path);
    return stat.isDirectory();
}