import { IEdge, IVisualData } from '../utils/type';

function dealPath(path: string): string {
	const cwd = process.cwd().replace(/\\/g, '/');
	return path.replace(cwd, '');
}

export default function(data: any, filePaths: string[]): IVisualData {
	const SYMBOLSIZE = 5;
	const nodes = filePaths.map(path => {
		const dependencys = data[path] ?? {};
		const len = Object.keys(dependencys).length;
		return {
			id: dealPath(path),
			name: dealPath(path),
			symbolSize: SYMBOLSIZE + (len % SYMBOLSIZE) + parseInt(String(len / SYMBOLSIZE)),
		};
	});
	const edges: IEdge[] = [];
	for (const key in data) {
		const dependencys = data[key];
		Object.keys(dependencys).forEach(dependencyKey => {
			const dependencyNames = dependencys[dependencyKey];
			edges.push({
				source: dealPath(key),
				target: dealPath(dependencyKey),
				tooltip: {
					formatter: `module: ${dependencyNames.join(',')}`,
				},
				label: {
					formatter: dependencyNames.join(','),
				},
			});
		});
	}
	return {
		nodes,
		edges,
	};
}
