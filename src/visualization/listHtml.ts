import { IReferenceRelation } from '../utils/type';

function dealPath(path: string): string {
	const newPath = path;
	const cwd = process.cwd().replace(/\\/g, '/');
	return newPath.replace(cwd, '');
}

export default function createTableReport(data: IReferenceRelation) {
	const htmlString = `
<table>
<tbody>
${Object.keys(data)
	.map((key, index) => {
		const impactScope = data[key];
		const scopeOfInfluence = Object.keys(impactScope).length;
		return `<tr class="bg-0" data-group="f-${index}">
                <th>
                    [+]
                    ${dealPath(key)}
                </th>
                <th>
                    Scope of influence: ${scopeOfInfluence}
                </th>
            </tr>
            ${Object.keys(impactScope)
							.map(
								scopeKey => `
                <tr style="display:none" class="f-${index}">
                <td>${dealPath(scopeKey)}</td>
                <td>${impactScope[scopeKey].join('|')}</td>
            </tr>
            `
							)
							.join('')}`;
	})
	.join('')}
</tbody>
</table>`;
	return htmlString;
}
