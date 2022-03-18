import dependencyAnalyz from '../dependency-analysis/index';
import { writeHtml } from '../utils/common';

export default function createReport() {
    const echartsData = dependencyAnalyz();
    const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.1/dist/echarts.js"></script>
        <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
    </head>

    <body>
        <div style="display: none" id="echarts-data">${JSON.stringify(echartsData)}</div>
        <div id="main" style="width: 100vw;height:100vh;"></div>
        <script type="module">
            const echartsData = JSON.parse(document.getElementById('echarts-data').innerText);
            var chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option;
            myChart.hideLoading();
            myChart.setOption(
                (option = {
                    title: {
                        text: 'NPM Dependencies'
                    },
                    animationDurationUpdate: 1500,
                    animationEasingUpdate: 'quinticInOut',
                    series: [
                        {
                            type: 'graph',
                            layout: 'none',
                            legendHoverLink: true,
                            // progressiveThreshold: 700,
                            data: echartsData.nodes.map(function (node) {
                                return {
                                    x: node.x,
                                    y: node.y,
                                    id: node.id,
                                    name: node.label,
                                    symbolSize: node.size,
                                    itemStyle: {
                                    color: node.color
                                    }
                                };
                            }),
                            edges: echartsData.edges.map(function (edge) {
                                return {
                                    source: edge.sourceID,
                                    target: edge.targetID
                                };
                            }),
                            emphasis: {
                                focus: 'adjacency',
                                label: {
                                    position: 'right',
                                    show: true
                                }
                            },
                            roam: true,
                            lineStyle: {
                                width: 1,
                                curveness: 0.3,
                                opacity: 0.7
                            }
                        }
                    ]
                }),
                true
            );
        </script>
    </body>
    </html>`.trimLeft();
    writeHtml('testReport.html', htmlString);
}