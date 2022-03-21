import { SourceFile } from 'ts-morph';
import { dependencyFileAbslutePathAnalysis } from '../utils/index';
import { IConfig, IModuleDependency } from '../utils/type';

function getImportDeclarationNodes(sourceFiles: SourceFile[]): IModuleDependency[] {
    const declarationNodes = sourceFiles.map(sourceFile => {
        const importDeclarations = sourceFile.getImportDeclarations();
        const moduleSpeciferValues = importDeclarations.map(importDeclaration => {
            return importDeclaration.getModuleSpecifierValue();
        });
        return {
            module: sourceFile.getFilePath(),
            dependency: moduleSpeciferValues,
        }
    });
    return declarationNodes;
}

function pathAnalysis(modules: IModuleDependency[], config: IConfig): IModuleDependency[] {
    return modules.map(module => {
        const modulePath = module.module;
        const dependencyPaths = module.dependency;
        const dependencyRealPaths = dependencyPaths.map(path => {
            const dependency = dependencyFileAbslutePathAnalysis(modulePath, path, config.pathConfig);
            return dependency.replace(/\\/g, '/');
        });
        return {
            module: modulePath,
            dependency: dependencyRealPaths
        }
    });
}

export default function (sourceFiles: SourceFile[], config: IConfig): IModuleDependency[] {
    const filesModuleAndDependency = getImportDeclarationNodes(sourceFiles);
    const res = pathAnalysis(filesModuleAndDependency, config);
    return res;
}