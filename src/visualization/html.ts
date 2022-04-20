import { IVisualData } from '../utils/type';

export default function createReport(echartsData: IVisualData) {
    const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.1/dist/echarts.js"></script>
        <script>
            function getNames(data, name) {
                const flagNodes = [];
                let res = [];
                const cursionFunc = (name) => {
                    if(flagNodes.indexOf(name) === -1) {
                        flagNodes.push(name);
                        res.push(name);
                        const nameEdges = data.filter(item => item.source === name);
                        if (nameEdges.length) {
                            const edgeTargets = nameEdges.map(edge => {
                                res.push(\`\${edge.source} > \${edge.target}\`);
                                return edge.target
                            });
                            edgeTargets.forEach(target => {
                                cursionFunc(target);
                            });
                        }
                    }
                }
                cursionFunc(name);
                return res;
            }
        </script>
    </head>

    <body>
        <div id="main" style="width: 100vw;height:100vh;"></div>
        <script type="module">
            const data = 
                ${JSON.stringify(echartsData)};
            const chartDom = document.getElementById('main');
            const myChart = echarts.init(chartDom);
            let selectedNames = [];
            let option;
            myChart.hideLoading();
            myChart.on('click', { dataType: 'node' }, (params) => {
                const { dataIndex, seriesId, name, dataType } = params;
                myChart.dispatchAction({
                    type: 'unselect',
                    seriesId,
                    dataType: 'node',
                    name: selectedNames,
                });
                myChart.dispatchAction({
                    type: 'unselect',
                    seriesId,
                    dataType: 'edge',
                    name: selectedNames,
                });
                selectedNames = getNames(data.edges, name);
                console.log(selectedNames);
                myChart.dispatchAction({
                    type: 'select',
                    seriesId,
                    dataType: 'node',
                    name: selectedNames,
                });
                myChart.dispatchAction({
                    type: 'select',
                    seriesId,
                    dataType: 'edge',
                    name: selectedNames,
                });
            });
            myChart.setOption(
                (option = {
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'force',
                            roam: true,
                            edgeSymbol: ['', 'arrow'],
                            edgeSymbolSize: 5,
                            // legendHoverLink: true,
                            // progressiveThreshold: 700,
                            draggable: true,
                            data: data.nodes,
                            edges: data.edges,
                            force: {
                                repulsion: 200,
                                edgeLenght: 10,
                            },
                            emphasis: {
                                focus: 'adjacency',
                                label: {
                                    position: 'bottom',
                                    show: true
                                }
                            },
                            selectedMode: 'multiple',
                            select: {
                                disabled: false,
                                label: {
                                    show: true,
                                    position: 'bottom',
                                },
                                itemStyle: {
                                    color: 'red',
                                },
                                lineStyle: {
                                    color: 'red',
                                    width: 5
                                },
                                edgeLabel: {
                                    show: true,
                                    color: 'blue'
                                }
                            },
                        }
                    ]
                }),
                true
            );
        </script>
    </body>
    </html>`.trimLeft();
    return htmlString;
}