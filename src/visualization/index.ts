// import { writeHtml } from '../utils/common';
import { IReferenceRelation } from '../utils/type';
import dataProcessing from './dataProcessing';
import createHtml from './html';
import createTableReport from './listHtml';

export default function(
  data: IReferenceRelation,
  finalData: IReferenceRelation,
  files: string[]
): string {
  const visualData = dataProcessing(data, files);
  return `
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>Cdaavt Report</title>
        <script src="https://unpkg.com/vue@2.6.14"></script>
        <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
        <script src="https://unpkg.com/element-ui/lib/index.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/echarts@5.3.1/dist/echarts.js"></script>
    </head>
    <style>
        body {
            font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
            font-size: 16px;
            font-weight: normal;
            margin: 0;
            padding: 0;
            color: #333
        }

        #overview {
            padding: 20px 30px
        }

        td,
        th {
            padding: 5px 10px
        }

        table {
            margin: 30px;
            width: calc(100% - 60px);
            max-width: 1000px;
            border-radius: 5px;
            border: 1px solid #ddd;
            border-spacing: 0px;
        }

        th {
            font-weight: 400;
            font-size: medium;
            text-align: left;
            cursor: pointer
        }

        tr:last-child td {
            border-bottom: none
        }

        tr td:first-child,
        tr td:last-child {
            color: #9da0a4
        }

        #overview.bg-0,
        tr.bg-0 th {
            color: #468847;
            background: #dff0d8;
            border-bottom: 1px solid #d6e9c6
        }

        tr.bg-0 th:hover {
            background: darkgray;
            color: white;
        }

        tr td:hover {
            background-color: darkgray;
            color: white;
        }

        td {
            border-bottom: 1px solid #ddd
        }
    </style>
    <body>
        <div id="app">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="力导向图" name="first">${createHtml(visualData)}</el-tab-pane>
                <el-tab-pane label="依赖关系列表" name="second">${createTableReport(finalData)}</el-tab-pane>
            </el-tabs>
        </div>
    </body>

    <script>
        new Vue({
            el: '#app',
            data: function () {
                return {
                    activeName: 'second'
                }
            },
            methods: {
                handleClick: (tab, event) => { console.log(tab, event); }
            }
        });

        var groups = document.querySelectorAll("tr[data-group]");
        for (i = 0; i < groups.length; i++) {
            groups[i].addEventListener("click", function () {
                var inGroup = document.getElementsByClassName(this.getAttribute("data-group"));
                this.innerHTML = (this.innerHTML.indexOf("+") > -1) ? this.innerHTML.replace("+", "-") : this.innerHTML.replace("-", "+");
                for (var j = 0; j < inGroup.length; j++) {
                    inGroup[j].style.display = (inGroup[j].style.display !== "none") ? "none" : "table-row";
                }
            });
        }

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
    </html>
    `.trimLeft();
}
