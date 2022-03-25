import { IVisualData } from '../utils/type';

export default function createReport(echartsData: IVisualData) {
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
                            layout: 'force',
                            // legendHoverLink: true,
                            // progressiveThreshold: 700,
                            draggable: true,
                            data: echartsData.nodes,
                            edges: echartsData.edges,
                            force: {
                                edgeLength: 5,
                                repulsion: 20,
                                gravity: 0.2
                            },
                            emphasis: {
                                focus: 'adjacency',
                                label: {
                                    position: 'right',
                                    show: true
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