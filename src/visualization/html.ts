import { IVisualData } from '../utils/type';

export default function createReport(echartsData: IVisualData) {
  const htmlString = `
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
                            edgeSymbolSize: 10,
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
        </script>`;
  return htmlString;
}
