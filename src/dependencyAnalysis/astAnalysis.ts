import { SourceFile, SyntaxKind, ObjectLiteralExpression } from 'ts-morph';
import { dependencyFileAbslutePathAnalysis } from '../utils/index';
import { IConfig, IModuleDependency } from '../utils/type';

function getImportDeclarationNodes(sourceFiles: SourceFile[]): IModuleDependency[] {
    const declarationNodes = sourceFiles.map(sourceFile => {
        const exports: string[] = [];
        const importDeclarations = sourceFile.getImportDeclarations();
        const exportedDeclarations = sourceFile.getExportedDeclarations();

        // 获取导出节点的名称，导出节点获取有三种
        for(const [name] of exportedDeclarations) {
            exports.push(name);
        }

        const exportDeclarations = sourceFile.getExportDeclarations();
        exportDeclarations.forEach(exportDeclaration => {
            const namedExports = exportDeclaration.getNamedExports();
            namedExports.forEach(namedExport => {
                exports.push(namedExport.getName());
            });
        });

        const exportAssignments = sourceFile.getExportAssignments();
        exportAssignments.forEach(exportAssignment => {
            const expression = exportAssignment.getExpression();
            const expressionKind = expression.getKind();
            if(expressionKind === SyntaxKind.Identifier) {
                exports.push(expression.getText());
            }
            if(expressionKind === SyntaxKind.ObjectLiteralExpression) {
                const properties = (expression as ObjectLiteralExpression).getProperties();
                properties.forEach(property => {
                    const propertyKind = property.getKind();
                    if(propertyKind === SyntaxKind.ShorthandPropertyAssignment) {
                        exports.push(expression.getText());
                    }
                });
            }
        });

        // 获取导入节点的路径
        const moduleSpeciferValues = importDeclarations.map(importDeclaration => {
            return importDeclaration.getModuleSpecifierValue();
        });

        return {
            module: sourceFile.getFilePath(),
            exports,
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
            ...module,
            module: modulePath,
            dependency: dependencyRealPaths
        }
    });
}

export default function (sourceFiles: SourceFile[], config: IConfig): IModuleDependency[] {
    const filesModuleAndDependency = getImportDeclarationNodes(sourceFiles);
    const res = pathAnalysis(filesModuleAndDependency, config);
    console.log(res);
    return res;
}