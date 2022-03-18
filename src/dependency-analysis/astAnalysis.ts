import { SourceFile } from 'ts-morph';
import { dependencyFileAbslutePathAnalysis } from '../utils/common';
import { IConfig, IFileModule } from '../utils/type';

function getImportDeclarationNodes(sourceFiles: SourceFile[]) {
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

function pathAnalysis(modules: IFileModule[], config: IConfig) {
    return modules.map(module => {
        const modulePath = module.module;
        const dependencyPaths = module.dependency;
        const dependencyRealPaths = dependencyPaths.map(path => {
            return dependencyFileAbslutePathAnalysis(modulePath, path, config.pathConfig)
        });
        return {
            module: modulePath,
            dependency: dependencyRealPaths
        }
    });
}

export default function (sourceFiles: SourceFile[], config: IConfig) {
    const filesModuleAndDependency = getImportDeclarationNodes(sourceFiles);
    pathAnalysis(filesModuleAndDependency, config);
}