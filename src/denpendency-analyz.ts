import { ImportDeclaration, Project, SourceFile  } from 'ts-morph';
import { isFileExists } from './utils/common';

function getAst() {
    let project = new Project();
    const jsConfigPath = 'jsconfig.json';
    const tsConfigPath = 'tsconfig.json';
    // const result = getCompilerOptionsFromTsConfig('cdaavt.config.json');
    // console.log(result);
    // const cdaavtConfigPath = 'cdaavt.config.json';
    if (isFileExists(jsConfigPath)) {
        project = new Project({
            tsConfigFilePath: jsConfigPath,
        });
    }
    if (isFileExists(tsConfigPath)) {
        project = new Project({
            tsConfigFilePath: tsConfigPath,
        });
    }
    const sourceFiles = project.getSourceFiles();
    return sourceFiles;
}

function analysisImportDeclarations(nodes: ImportDeclaration[]) {
    // 去掉样式引用
    const effectiveNodes = nodes.filter(node => {
        const reg = /\.less|\.css|\.scss/;
        // 获取引用路径
        const moduleSpecifierValue = node.getModuleSpecifierValue();
        return !reg.test(moduleSpecifierValue);
    });

    // 将路径转换为绝对路径
    const moduleSpecifierValues = effectiveNodes.map(node => {
        const reg = /(\@\/)|(\.\/)|(\.\.\/)/;
        const moduleSpecifierValue = node.getModuleSpecifierValue();
        if (reg.test(moduleSpecifierValue)) {
            // TODO: getModuleSpecifierSourceFile函数可能返回undefined
            return node.getModuleSpecifierSourceFile()?.getFilePath() || moduleSpecifierValue;
        }
        return moduleSpecifierValue;
    });
    return moduleSpecifierValues;
}

function astAnalysis(sourceFiles: SourceFile[]) {
    const res = sourceFiles.map(item => {
        const importDeclarations = item.getImportDeclarations();
        const filePath = item.getFilePath();
        const moduleSpecifierValues = analysisImportDeclarations(importDeclarations);
        return {
            filePath,
            moduleSpecifierValues
        }
    });
    console.log(res);
}

export default function depAnalysis() {
    const sourceFiles = getAst();
    astAnalysis(sourceFiles);
}
