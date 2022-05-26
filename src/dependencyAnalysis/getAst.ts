import { Project, SourceFile } from 'ts-morph';

export default function(files: string[]): SourceFile[] {
	const project = new Project();
	const sourceFiles = project.addSourceFilesAtPaths(files);
	return sourceFiles;
}
