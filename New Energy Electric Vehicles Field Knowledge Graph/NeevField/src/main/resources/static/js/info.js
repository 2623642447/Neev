let item = window.localStorage.getItem("item");
let id = window.localStorage.getItem("id");
let path = "/" + item + "/" + id;
let dom = document.querySelector("#container");
let myChart = echarts.init(dom);
// let myChart1 = echarts.init(document.getElementById('content'),'light');
let graphData;
let append = false;//是否为追加模式
let cube = false;//是否为3D模式
let update = false;//图数据是否刷新
let fix = true;
let gData;
let colors = ['#d74848', '#68b344', '#c74ca6', '#cb9c32', '#5470c6'];
getData(path);

const appendModeDom = document.querySelector(".append_mode");
const updateModeDom = document.querySelector(".update_mode");
const fixModeDom = document.querySelector(".fix_mode");
appendModeDom.addEventListener("click", function () {
    appendModeDom.classList.add("select_mode");
    updateModeDom.classList.remove("select_mode");
    fixModeDom.classList.remove("select_mode");
    append = true;
    fix = false;
});
updateModeDom.addEventListener("click", function () {
    updateModeDom.classList.add("select_mode");
    appendModeDom.classList.remove("select_mode");
    fixModeDom.classList.remove("select_mode");
    append = false;
    fix = false;
});
fixModeDom.addEventListener("click", function () {
    fix = true;
    fixModeDom.classList.add("select_mode");
    appendModeDom.classList.remove("select_mode");
    updateModeDom.classList.remove("select_mode");
})

const changModeDom = document.querySelector("#change_mode");
const cubeContainerDom = document.querySelector("#container_3d");
changModeDom.addEventListener("click", function () {
    if (cube){//切换为2D
        $("#change_mode").css("background-image", 'url("/images/3d.svg")');
        $("#container_3d").css("width", "0px");
        $("#container_3d").css("height", "0px");
        $("#app").css("width", "100%");
        $("#app").css("height", "100%");
        $("#category_3d").css("display", "none");

        $("#info").css("background-color", "#fff");
        $("#info").removeClass("info3d");
        $("#info").addClass("info2d");
        $("main").css("background-color", "#fff");

        cube = false;
        update = false;
    }else {//切换为3D
        $("#change_mode").css("background-image", 'url("/images/2d.svg")');
        $("#container_3d").css("width", "100%");
        $("#container_3d").css("height", "100%");
        $("#app").css("width", "0px");
        $("#app").css("height", "0px");
        $("#category_3d").css("display", "block");

        $("#info").css("background-color", "#000011");
        $("#info").addClass("info3d");
        $("#info").removeClass("info2d");
        $("main").css("background-color", "#000011");

        cube = true;
        if (update){
            let gData = changeData3D(graphData);
            graph3d(gData, 3);
        }
    }
})

function loading3D(tip) {
    $("#loading_page").css("display", "block");
    $(".loading_tip").text(tip);
}

function hiddenLoading3D() {
    $("#loading_page").css("display", "none");
}

function getData(sendPath) {
    $.ajax({
        url: sendPath,
        type: "GET",
        dataType: "json",
        success: function (jsonData) {
            update = true;
            updateInfo(jsonData.item, jsonData.info);
            if (append){
                appendData(jsonData.graphData);
            }else {
                graphData = jsonData.graphData;
                graph(jsonData.relationGraphData);
            }
            gData = changeData3D(graphData);
            graph3d(gData, 3);
        }
    });
}

//添加节点和关连
function addData(data) {
    for (let d of data.nodes){
        if (whetherInsertNode(d, graphData)){
            graphData.nodes.push(d);
        }
    }
    for (let e of data.links){
        graphData.links.push(e);
    }
}

function appendData(data) {
    addData(data);
    myChart.hideLoading();
    myChart.setOption({
        series: [
            {
                roam: true,
                data: graphData.nodes,
                edges: graphData.links
            }
        ]
    });
}

//判断当前节点是否已经存在于GraphData中
function whetherInsertNode(node, gd) {
    for (let g of gd.nodes){
        if (node.id == g.id){
            return false;
        }
    }
    return true;
}

function Node3D(id, name, group) {
    this.id = id;
    this.name = name;
    this.group = group;
}

function Edge3D(source, target, val) {
    this.source = source;
    this.target = target;
    this.value = 2;
    this.val = val;
}

function GraphData3D(nodes, links) {
    this.nodes = nodes;
    this.links = links;
}

function changeData3D(data) {
    let nodes = data.nodes;
    let links = data.links;
    let node3ds = new Array();
    let link3ds = new Array();
    for (let node of nodes){
        node3ds.push(new Node3D(node.id, node.name, node.category));
    }
    for (let link of links){
        link3ds.push(new Edge3D(link.source, link.target, getRelationByChar(link.source, link.target)));
    }
    let data3d = new GraphData3D(node3ds, link3ds);
    return data3d;
}

function getCategoryName(category) {
    let categoryName = "";
    switch (category) {
        case 0:
            categoryName = "公司";
            break;
        case 1:
            categoryName = "产业";
            break;
        case 2:
            categoryName = "产品";
            break;
        // case 3:
        //     categoryName = "典籍";
        //     break;
        // case 4:
        //     categoryName = "地理位置";
        //     break;
    }
    return categoryName;
}

function getEnglishCategoryName(category) {
    let categoryName = "";
    switch (category) {
        case 0:
            categoryName = "company";
            break;
        case 1:
            categoryName = "industry";
            break;
        case 2:
            categoryName = "product";
            break;
        // case 3:
        //     categoryName = "book";
        //     break;
        // case 4:
        //     categoryName = "geography";
        //     break;
    }
    return categoryName;
}

function getEnglishCategoryNameByChar(category) {
    let categoryName = "";
    switch (category) {
        case "com":
            categoryName = "company";
            break;
        case "ind":
            categoryName = "industry";
            break;
        case "pro":
            categoryName = "product";
            break;
        // case "b":
        //     categoryName = "book";
        //     break;
        // case "g":
        //     categoryName = "geography";
        //     break;
        // case "hi":
        //     categoryName = "herbInfo";
        //     break;
    }
    return categoryName;
}

function getNodeByNodeId(data, nodeId) {
    for (let i=0; i<data.length; i++){
        if (data[i].id == nodeId){
            return data[i];
        }
    }
}

function getRelation(source, target, tip) {
    let txt = "";
    if (tip){
        txt = "关系：";
    }
    if (source.category == 0 && target.category == 0){
        return txt + "竞争";
    }else if (source.category == 0 && target.category == 1){
        return txt + "归属于";
    }else if (source.category == 0 && target.category == 2){
        return txt + "拥有";
    }else if (source.category == 1 && target.category == 0){
        return txt + "具有";
    }else if (source.category == 1 && target.category == 1){
        return txt + "上下游";
    }else if (source.category == 2 && target.category == 0){
        return txt + "归属于";
    }else if (source.category == 2 && target.category == 2){
        return txt + "竞争";
    }else if (source.category == 1 && target.category == 3){
        return txt + "下游";
    }else if (source.category == 1 && target.category == 4){
        return txt + "上游";
    }
}

function getRelationByChar(source, target) {
    let s = source.substring(0,1);
    let t = target.substring(0,1);
    if (s == "c" && t == "c"){
        return "竞争";
    }else if (s == "c" && t == "i"){
        return "归属";
    }else if (s == "c" && t == "p"){
        return "拥有";
    }else if (s == "i" && t == "c"){
        return "具有";
    }else if (s == "i" && t == "i"){
        return "上下游";
    }else if (s == "p" && t == "c"){
        return "归属";
    }else if (s == "p" && t == "p"){
        return "竞争";
    }
}

function graph(relationGraphData){
    myChart.hideLoading();

    const app = new Vue({
        el : '#app',
        name: 'RelationGraphDemo',
        components: { },
        data() {
            return {
                g_loading: true,
                demoname: '---',
                graphOptions: {
                    'layouts': [
                        {
                            'label': '中心',
                            'layoutName': 'tree',
                            'layoutClassName': 'seeks-layout-center',
                            'defaultJunctionPoint': 'border',
                            'defaultNodeShape': 0,
                            'defaultLineShape': 1,
                            'from': 'left',
                            'max_per_width': '300',
                            'min_per_height': '40'
                        }
                    ],
                    'defaultLineMarker': {
                        'markerWidth': 12,
                        'markerHeight': 12,
                        'refX': 6,
                        'refY': 6,
                        'data': 'M2,2 L10,6 L2,10 L6,6 L2,2'
                    },
                    moveToCenterWhenRefresh: false,
                    'defaultExpandHolderPosition': 'right',
                    'defaultNodeShape': 1,
                    'defaultNodeWidth': '100',
                    'defaultLineShape': 4,
                    'defaultJunctionPoint': 'lr',
                    'defaultNodeBorderWidth': 0,
                    'defaultLineColor': 'rgba(0, 186, 189, 1)',
                    'defaultNodeColor': 'rgba(0, 206, 209, 1)'
                }
            };
        },
        created() {
        },
        mounted() {
            // this.demoname = this.$route.params.demoname;
            this.setGraphData();
        },
        methods: {
            setGraphData() {
                // 使用要点：通过节点属性expandHolderPosition: 'right' 和 expanded: false 可以让节点在没有子节点的情况下展示一个"展开"按钮
                //         通过onNodeExpand事件监听节点，在被展开的时候有选择的去从后台获取数据，如果已经从后台加载过数据，则让当前图谱根据当前的节点重新布局
                const __graph_json_data = relationGraphData;

                console.log(JSON.stringify(__graph_json_data));
                setTimeout(() => {
                    this.g_loading = false;
                    this.$refs.graphRef.setJsonData(__graph_json_data, (graphInstance) => {
                        // 这些写上当图谱初始化完成后需要执行的代码
                    });
                }, 1000);
            },
            onNodeCollapse(node, e) {
                this.$refs.graphRef.refresh();
            },
            // 通过onNodeExpand事件监听节点的展开事件，在被展开的时候有选择的去从后台获取数据，如果已经从后台加载过数据，则让当前图谱根据当前的节点重新布局
            onNodeExpand(node, e) {
                console.log('onNodeExpand:', node);
                // 根据具体的业务需要决定是否需要从后台加载数据
                if (!node.data.isNeedLoadDataFromRemoteServer) {
                    console.log('这个节点的子节点已经加载过了');
                    this.$refs.graphRef.refresh();
                    return;
                }
                // 判断是否已经动态加载数据了
                if (node.data.childrenLoaded) {
                    console.log('这个节点的子节点已经加载过了');
                    this.$refs.graphRef.refresh();
                    return;
                }
                this.g_loading = true;
                node.data.childrenLoaded = true;
                this.loadChildNodesFromRemoteServer(node, new_data => {
                    this.g_loading = false;
                    this.$refs.graphRef.getInstance().appendJsonData(new_data, (graphInstance) => {
                        // 这些写上当图谱初始化完成后需要执行的代码
                    });
                });
            },
            loadChildNodesFromRemoteServer(node, callback) {
                setTimeout(function() {
                    const _new_json_data = {
                        nodes: [
                            { id: node.id + '-child-1', text: node.id + '-的动态子节点1', width: 150 },
                            { id: node.id + '-child-2', text: node.id + '-的动态子节点2', width: 150 },
                            { id: node.id + '-child-3', text: node.id + '-的动态子节点3', width: 150 }
                        ],
                        lines: [
                            { from: node.id, to: node.id + '-child-1', text: '动态子节点' },
                            { from: node.id, to: node.id + '-child-2', text: '动态子节点' },
                            { from: node.id, to: node.id + '-child-3', text: '动态子节点' }
                        ]
                    };
                    callback(_new_json_data);
                }, 1000);
            }
        }
    });
}

function findNodeGroupByTarget(nodes, target) {
    for (let node of nodes){
        if (node.id == target){
            return node.group;
        }
    }
}

let clickNode = null;
let Graph;
function graph3d(gData, idx){
    //hiddenLoading3D();
    const elem = document.getElementById('container_3d');
    Graph = ForceGraph3D()
    (elem)
        .dagMode('bu')
        .dagLevelDistance(100)
        .nodeRelSize(10)
        .nodeColor(node => {
            if (node.name=="新能源汽车"){
                return colors[0]
            }
            //ind20005
            if (node.id.substring(3)>=20005 && node.id.substring(3)<=20010){
                return colors[1]
            }
            if (node.id.substring(3)==20091){
                return colors[1]
            }
            if (node.id.substring(3)>=20061 && node.id.substring(3)<=20064){
                return colors[1]
            }
            if (node.id.substring(3)>=20070 && node.id.substring(3)<=20090 && node.id.substring(3)!=20072){
                return colors[1]
            }
            if (node.id.substring(3)==20025){
                return colors[1]
            }
            if (node.id.substring(3)>=20016 && node.id.substring(3)<=20022){
                return colors[1]
            }
            if (node.id.substring(3)>=20043 && node.id.substring(3)<=20055){
                return colors[1]
            }
            if (node.id.substring(3)>=20034 && node.id.substring(3)<=20038){
                return colors[1]
            }
            if (node.id.substring(3)>=20061 && node.id.substring(3)<=20064){
                return colors[1]
            }
            if (node.id.substring(3)>=20054 && node.id.substring(3)<=20056){
                return colors[1]
            }
            if (node.id.substring(3)>=20068 && node.id.substring(3)<=20069){
                return colors[1]
            }
            if (node.id.substring(3)>=20043 && node.id.substring(3)<=20047){
                return colors[1]
            }
            if (node.id.substring(3)>=20028 && node.id.substring(3)<=20031){
                return colors[1]
            }
            else return colors[2]
        })
        // .backgroundColor('rgba(255,255,255,1.0)')
        .nodeThreeObject(node=>{
            return addSpriteText(node);
        })
        .nodeThreeObjectExtend((node=>{
            return true
        }))

        .nodeLabel(node => `<div class='node-label2'>${node.name}</div>`)
        .linkLabel((link)=>{//鼠标移上连线展示信息
            let label = "关系：" + link.val;
            return label;
        })
        // .linkAutoColorBy(d => {
        //     return findNodeGroupByTarget(gData.nodes, d.target);
        // })
        .linkColor("#68b344")
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .onNodeClick(node => {
            dataHisEchartsByClick(node.name);
        })
        .onNodeRightClick(node => {

        })
        .linkWidth(1)
        .width($("#container").width())
        .height($("#container").height())
        .graphData(gData)
        .d3Force('collision', d3.forceCollide(node => Graph.nodeRelSize()+5));
    Graph.numDimensions(idx);
    // Graph.nodeThreeObject(node => {
    //         const nodeEl = document.createElement("div");
    //         nodeEl.textContent = node.name;
    //         nodeEl.style.color = "#68b344";
    //         nodeEl.className = 'node-label';
    //         return new CSS2DObject(nodeEl);
    //     });
    // Graph.nodeThreeObjectExtend(true);
    // Graph.d3Force('charge').strength(-200);
    Graph.dagLevelDistance(75);
}

function find3DNodeBySId(sid) {
    if (Graph && gData){
        for (let node of gData.nodes) {
            if (node.id == sid){
                return node;
            }
        }
    }
    return null;
}

function moveCamera(node) {
    if (node && Graph){
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        Graph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );
    }
}

function addSpriteText(node){
    const sprite = new SpriteText(node.name);
    sprite.color = '#fff';
    sprite.textHeight = 8;
    sprite.position.set(0,12,0);
    return sprite;
}

function updateInfo(item, data){
    switch (item) {
        case "company":
            companyInfo(data);
            break;
        case "industry":
            industryInfo(data);
            break;
        case "product":
            productInfo(data);
            break;
        // case "herbInfo":
        //     oneHerbInfo(data);
        //     break;
        // case "disease":
        //     diseaseAndBookInfo(data, "disease");
    }
}

function companyInfo(data) {
    let content = ``;
    let comName = data.comName;
    if (content.length == 0){
        content = content + `<div>
                                <div class="title">公司名称</div>
                                <div class="content location" data-sid="h${data.comId}">${comName}<span title="报错" class="error" data-type="company" data-id="${data.comId}"></span></div>
                                <div class="content">抱歉，数据库中暂未收录该公司的具体信息</div>
                            </div>`;
    }else {
        content = content + `<div>
                                <div class="title">公司名称</div>
                                <div class="content location" data-sid="h${data.comId}">${comName}<span title="报错" class="error" data-type="company" data-id="${data.comId}"></span></div>
                            </div>`;
    }

    $("#info").html(content);
    fold();
}

function industryInfo(data) {
    let content = ``;
    let indName = data.indName;
    // let desContent = data.description.desContent;
    let desContent = "";
    if (desContent.length == 0){
        content = content + `<div>
                                <div class="title">产业名称</div>
                                <div class="content location" data-sid="h${data.indId}">${indName}<span title="报错" class="error" data-type="industry" data-id="${data.indId}"></span></div>
                                <div class="content">抱歉，数据库中暂未收录该产业的具体信息</div>
                            </div>`;
    }else {
        content = content + `<div>
                                <div class="title">产业名称</div>
                                <div class="content location" data-sid="h${data.indId}">${indName}<span title="报错" class="error" data-type="industry" data-id="${data.indId}"></span></div>                      
                                <div class="content">
                                ${desContent}</div>
                                销售趋势图
                            </div>`;
    }

    $("#info").html(content);
    dataHisEcharts();
    fold();
}

function productInfo(data) {
    let content = ``;
    let proName = data.proName;
    if (content.length == 0){
        content = content + `<div>
                                <div class="title">产品名称</div>
                                <div class="content location" data-sid="h${data.proId}">${proName}<span title="报错" class="error" data-type="product" data-id="${data.proId}"></span></div>
                                <div class="content">抱歉，数据库中暂未收录该产品的具体信息</div>
                            </div>`;
    }else {
        content = content + `<div>
                                <div class="title">产品名称</div>
                                <div class="content location" data-sid="h${data.proId}">${proName}<span title="报错" class="error" data-type="product" data-id="${data.proId}"></span></div>
                            </div>`;
    }

    $("#info").html(content);
    fold();
}




// function diseaseAndBookInfo(data, type) {
//     let content = ``;
//     if (type == 'book'){
//         content = `<div>
//                         <div class="title">典籍名称</div>
//                         <div class="content location" data-sid="b${data.bookId}">${data.bookName}<span title="报错" class="error" data-type="book" data-id="${data.bookId}"></span></div>
//                    </div>`;
//     }else {
//         content = `<div>
//                         <div class="title">病症名称</div>
//                         <div class="content location" data-sid="d${data.diseaseId}">${data.diseaseName}<span title="报错" class="error" data-type="disease" data-id="${data.diseaseId}"></span></div>
//                    </div>`;
//     }
//     let herbInfoList = data.herbInfoList;
//     let herbCount = 0;
//     let herbPage = 0;
//     if (herbInfoList.length > 0){
//         content = content + `<div class="book_herb"><div class="herb_groups">草药（共${herbInfoList.length}种）</div><div class="groups_herb">`;
//     }else {
//         content = content + `<div class="book_herb"><div class="groups_herb">`;
//     }
//     for (let herbInfo of herbInfoList){
//         if (herbCount == 0){
//             content = content + `<div class="group_herb">`;
//             herbPage = herbPage + 1;
//         }
//         content = content + herbInfoHtml(herbInfo, herbInfo.herbName);
//         herbCount = herbCount + 1;
//         if (herbCount == 10){
//             content = content + `</div>`;
//             herbCount = 0;
//         }
//     }
//     if (herbCount % 10 != 0){
//         content = content + `</div>`;
//     }
//     if (herbInfoList.length > 10){
//         content = content + `</div><div class="arrow-left-herb"></div><div class="herb-page"><span class="herb-now-page">1</span>/${herbPage}</div><div class="arrow-right-herb"></div></div>`;
//     }else {
//         content = content + `</div></div>`;
//     }
//
//     let prescriptionInfoList = data.prescriptionInfoList;
//     let prescriptionMap = computerSimplyPrescription(prescriptionInfoList);
//
//     let count = 0;
//     let prescriptionPage = 0;
//     if (prescriptionMap.size > 0){
//         content = content + `<div class="book_prescription"><div class="prescription_groups">药剂（共${prescriptionMap.size}剂）</div><div class="groups_pre">`;
//     }else {
//         content = content + `<div class="book_prescription"><div class="groups_pre">`;
//     }
//
//     for (let [prescriptionId, prescription] of prescriptionMap){
//         if (count == 0){
//             content = content + `<div class="group_pre">`;
//             prescriptionPage = prescriptionPage + 1;
//         }
//         content = content + `<div class="pre_index" data-type="prescription" data-id="${prescriptionId}" data-sid="p${prescriptionId}">
//                                 <div class="name">${prescription.prescriptionName}</div>
//                                 <span class="error_icon" title="纠错"></span>
//                                 <span class="spr_icon"></span>
//                             </div>
//                             <div class="pre">`;
//
//         let preInfoList = prescription.prescriptionInfoList;
//         if (preInfoList.length == 1){
//             let pInfo = preInfoList[0];
//             content = content + prescriptionInfoHtml(pInfo);
//         }else{
//             for (let i = 0; i < preInfoList.length; i++) {
//                 let pInfo = preInfoList[i];
//                 content = content + prescriptionHtml(pInfo, `（${(i+1)}）${pInfo.prescriptionName}`);
//             }
//         }
//         content = content + `</div>`;
//         count = count + 1;
//         if (count == 10){
//             content = content + `</div>`;
//             count = 0;
//         }
//     }
//     if (count % 10 != 0){
//         content = content + `</div>`;
//     }
//     if (prescriptionMap.size > 10){
//         content = content + `</div><div class="arrow-left"></div><div class="prescription-page"><span class="pre-now-page">1</span>/${prescriptionPage}</div><div class="arrow-right"></div></div>`;
//     }else {
//         content = content + `</div></div>`;
//     }
//
//     $("#info").html(content);
//     fold();
//     preIndex = 0;
//     herbIndex = 0;
//     moveScrollBar();//必须写在fold()之后
// }
//
// function oneHerbInfo(data) {
//     let content = ``;
//     let herbName = data.herbName;
//     for (let attr in data){
//         let chineseName = field.get(attr);
//         if (chineseName){
//             let describe = data[attr];
//             if (describe){
//                 content = content + `
//                     <div>
//                         <div class="title">${chineseName}</div>
//                         <div class="content ${attr}">${describe.replace(herbName, `<span class="key_word">${herbName}</span>`)}</div>
//                     </div>
//                     `;
//             }
//         }
//     }
//     $("#info").html(content);
// }
//
// function herbInfo(data) {
//     let content = ``;
//     let herbName = data.herbName;
//     let herbInfoList = data.herbInfoList;
//     if (herbInfoList.length == 0){
//         content = content + `<div>
//                                 <div class="title">草药名称</div>
//                                 <div class="content location" data-sid="h${data.herbId}">${herbName}<span title="报错" class="error" data-type="herb" data-id="${data.herbId}"></span></div>
//                                 <div class="content">抱歉，数据库中暂未收录该草药的生境分布、性味、炮制方法等信息</div>
//                             </div>`;
//     }else {
//         content = content + `<div>
//                                 <div class="title">草药名称</div>
//                                 <div class="content location" data-sid="h${data.herbId}">${herbName}<span title="报错" class="error" data-type="herb" data-id="${data.herbId}"></span></div>
//                             </div>`;
//         for (let herbInfo of herbInfoList){
//             content = content + herbInfoHtmlUnion(herbInfo, herbName, data.herbId);
//         }
//     }
//
//
//     $("#info").html(content);
//     fold();
// }
//
// function herbInfoHtmlUnion(herbInfo, herbName, herbId) {
//     let text = ``;
//     if (herbInfo.herbName == herbName){
//         text = text + `<div class="pre_index" data-type="herbInfo" data-id="${herbInfo.herbInfoId}" data-sid="hi${herbInfo.herbInfoId}" data-hsid="h${herbId}">`;
//     }else {
//         text = text + `<div class="pre_index" data-type="herbInfo" data-id="${herbInfo.herbInfoId}" data-sid="hi${herbInfo.herbInfoId}">`;
//     }
//     text = text + `<div class="name">${herbInfo.herbName}</div>
//                             <span class="error_icon" title="纠错"></span>
//                             <span class="spr_icon"></span>
//                         </div>
//                         <div class="pre">`;
//     for (let attr in herbInfo){
//         let chineseName = field.get(attr);
//         if (chineseName && attr != "herbName"){
//             let describe = herbInfo[attr];
//             if (describe){
//                 text = text + `
//                     <div>
//                         <div class="title">${chineseName}</div>
//                         <div class="content ${attr}">${describe.replace(herbName, `<span class="key_word">${herbName}</span>`)}</div>
//                     </div>
//                     `;
//             }
//         }
//     }
//     text = text + `</div>`;
//     return text;
// }
//
// function herbInfoHtml(herbInfo, herbName) {
//     let text = ``;
//     text = text + `<div class="pre_index" data-type="herbInfo" data-id="${herbInfo.herbInfoId}" data-sid="hi${herbInfo.herbInfoId}">
//                             <div class="name">${herbInfo.herbName}</div>
//                             <span class="error_icon" title="纠错"></span>
//                             <span class="spr_icon"></span>
//                         </div>
//                         <div class="pre">`;
//     for (let attr in herbInfo){
//         let chineseName = field.get(attr);
//         if (chineseName && attr != "herbName"){
//             let describe = herbInfo[attr];
//             if (describe){
//                 text = text + `
//                     <div>
//                         <div class="title">${chineseName}</div>
//                         <div class="content ${attr}">${describe.replace(herbName, `<span class="key_word">${herbName}</span>`)}</div>
//                     </div>
//                     `;
//             }
//         }
//     }
//     text = text + `</div>`;
//     return text;
// }
//
// function prescriptionInfo(data) {
//     let content = `<div>
//                         <div class="title">药剂名称</div>
//                         <div class="content location" data-sid="p${data.prescriptionId}">${data.prescriptionName}<span title="报错" class="error" data-type="prescription" data-id="${data.prescriptionId}"></span></div>
//                    </div>`;
//     let prescriptionInfoList = data.prescriptionInfoList;
//     for (let i = 0; i < prescriptionInfoList.length; i++){
//         let pInfo = prescriptionInfoList[i];
//         content = content + prescriptionHtmlByBook(pInfo, pInfo.prescriptionProvenance.replace("。",""));
//     }
//
//     $("#info").html(content);
//     fold();
// }
//
// function Prescription(prescriptionId, prescriptionName) {
//     this.prescriptionId = prescriptionId;
//     this.prescriptionName = prescriptionName;
//     this.prescriptionInfoList = new Array();
//     this.addPrescriptionInfo = function (prescriptionInfo) {
//         this.prescriptionInfoList.push(prescriptionInfo);
//     }
// }
//
// function computerSimplyPrescription(prescriptionInfoList) {
//     let prescriptionMap = new Map();
//     for (let i = 0; i < prescriptionInfoList.length; i++) {
//         let prescription = prescriptionMap.get(prescriptionInfoList[i].prescriptionId);
//         if(prescription){
//             prescription.addPrescriptionInfo(prescriptionInfoList[i]);
//         }else {
//             prescription = new Prescription(prescriptionInfoList[i].prescriptionId, prescriptionInfoList[i].prescriptionName);
//             prescription.addPrescriptionInfo(prescriptionInfoList[i]);
//             prescriptionMap.set(prescriptionInfoList[i].prescriptionId, prescription);
//         }
//     }
//     return prescriptionMap;
// }
//
// function prescriptionHtmlByBook(pInfo, name) {
//     let content = ``;
//     let bsid = '';
//     if (pInfo.bookList){
//         bsid = 'b' + pInfo.bookList[0].bookId;
//     }
//     content = content + `<div class="pre_index" data-type="prescriptionInfo" data-id="${pInfo.prescriptionInfoId}" data-sid="pi${pInfo.prescriptionInfoId}" data-bsid="${bsid}">
//                             <div class="name">${name}</div>
//                             <span class="error_icon" title="纠错"></span>
//                             <span class="spr_icon"></span>
//                         </div>
//                         <div class="pre">`;
//     content = content + prescriptionInfoHtml(pInfo);
//     content = content + `</div>`;
//     return content;
// }
//
// function prescriptionHtml(pInfo, name) {
//     let content = ``;
//     content = content + `<div class="pre_index" data-type="prescriptionInfo" data-id="${pInfo.prescriptionInfoId}" data-sid="pi${pInfo.prescriptionInfoId}">
//                             <div class="name">${name}</div>
//                             <span class="error_icon" title="纠错"></span>
//                             <span class="spr_icon"></span>
//                         </div>
//                         <div class="pre">`;
//     content = content + prescriptionInfoHtml(pInfo);
//     content = content + `</div>`;
//     return content;
// }
//
// function prescriptionInfoHtml(pInfo) {
//     let content = ``;
//     for (let attr in pInfo){
//         let chineseName = field.get(attr);
//         if (chineseName && attr != "prescriptionName" && attr != "prescriptionProvenance"){
//             let describe = pInfo[attr];
//             if (describe){
//                 content = content + `
//                     <div>
//                         <div class="title">${chineseName}</div>
//                         <div class="content">${describe}</div>
//                     </div>
//                 `;
//             }
//         }
//     }
//     return content;
// }

function turnPagePre(num){
    let width = $(".group_pre:nth-child(1)").width();
    let move = num * width;
    $(".groups_pre").animate({
        scrollLeft: move
    }, 500);
}

function turnPageHerb(num){
    let width = $(".group_herb:nth-child(1)").width();
    let move = num * width;
    $(".groups_herb").animate({
        scrollLeft: move
    }, 500);
}

function recoveryPre(index) {
    $(".group_pre:nth-child("+index+")").children(".pre").height(0);
    $(".group_pre:nth-child("+index+")").children(".pre_index").children(".spr_icon").css("transform", "rotate(-90deg)");
    for (let i=0;i<spread.length;i++){
        spread[i] = false;
    }
}

function recoveryHerb(index) {
    $(".group_herb:nth-child("+index+")").children(".pre").height(0);
    $(".group_herb:nth-child("+index+")").children(".pre_index").children(".spr_icon").css("transform", "rotate(-90deg)");
    for (let i=0;i<spread.length;i++){
        spread[i] = false;
    }
}

let preIndex = 0;
let herbIndex = 0;
function moveScrollBar() {
    const leftArrowDom = document.querySelector(".arrow-left");
    const rightArrowDom = document.querySelector(".arrow-right");
    if (leftArrowDom){
        leftArrowDom.addEventListener("click", function () {
            if (preIndex != 0){
                $(".group_pre:nth-child("+(preIndex+1)+")").children(".pre").height(0);
                preIndex = preIndex - 1;
                turnPagePre(preIndex);
                $(".pre-now-page").text(preIndex + 1);
            }
        });
    }
    if (rightArrowDom){
        rightArrowDom.addEventListener("click", function () {
            let max = $(".group_pre").length - 1;
            if (preIndex != max){
                recoveryPre(preIndex + 1);
                preIndex = preIndex + 1;
                turnPagePre(preIndex);
                $(".pre-now-page").text(preIndex + 1);
            }
        });
    }

    const leftArrowHerbDom = document.querySelector(".arrow-left-herb");
    const rightArrowHerbDom = document.querySelector(".arrow-right-herb");
    if (leftArrowHerbDom){
        leftArrowHerbDom.addEventListener("click", function () {
            if (herbIndex != 0){
                $(".group_herb:nth-child("+(herbIndex+1)+")").children(".pre").height(0);
                herbIndex = herbIndex - 1;
                turnPageHerb(herbIndex);
                $(".herb-now-page").text(herbIndex + 1);
            }
        });
    }
    if (rightArrowHerbDom){
        rightArrowHerbDom.addEventListener("click", function () {
            let max = $(".group_herb").length - 1;
            if (herbIndex != max){
                recoveryHerb(herbIndex + 1);
                herbIndex = herbIndex + 1;
                turnPageHerb(herbIndex);
                $(".herb-now-page").text(herbIndex + 1);
            }
        });
    }

}

let spread = new Array();
function fold() {
    let preIndexs = document.querySelectorAll(".pre_index");
    let pres = document.querySelectorAll(".pre");
    let icons = document.querySelectorAll(".spr_icon");
    let errors = document.querySelectorAll(".error_icon");
    spread = new Array(preIndexs.length);
    for (let i=0;i<spread.length;i++){
        spread[i] = false;
    }
    for (let i=0;i<preIndexs.length;i++){
        preIndexs[i].addEventListener("click", function(evt){
            if (spread[i]){
                pres[i].setAttribute("style", "height: 0px;");
                icons[i].setAttribute("style", "transform: rotate(-90deg);");
                spread[i] = false;
                errors[i].setAttribute("style", "display:none;");
            } else{
                let ch = pres[i].childElementCount;
                let height = 0;
                for (let j=0;j<ch;j++){
                    height = height + pres[i].children[j].clientHeight + 10;
                }
                height = height + 10;
                let parent = pres[i].parentElement;
                if (parent.className == "pre"){
                    let ph = parent.clientHeight + height;
                    parent.setAttribute("style", "height: "+ph+"px");
                }

                pres[i].setAttribute("style", "height: "+height+"px;");
                icons[i].setAttribute("style", "transform: rotate(0deg);");
                spread[i] = true;

                errors[i].setAttribute("style", "display:block;");
                errors[i].addEventListener("click", function (e) {
                    e.stopPropagation();
                    let type = preIndexs[i].getAttribute("data-type");
                    let id = preIndexs[i].getAttribute("data-id");
                    window.localStorage.setItem("errorType", type);
                    window.localStorage.setItem("errorId", id);
                    window.open("/tcm/correction");
                });

                if (cube){
                    let bsid = preIndexs[i].getAttribute("data-bsid");
                    let hsid = preIndexs[i].getAttribute("data-hsid");
                    if (bsid){
                        let node = find3DNodeBySId(bsid);
                        moveCamera(node);
                    }else if (hsid){
                        let node = find3DNodeBySId(hsid);
                        moveCamera(node);
                    }else {
                        let sid = preIndexs[i].getAttribute("data-sid");
                        let node = find3DNodeBySId(sid);
                        moveCamera(node);
                    }
                }
            }
        });
    }

    let esDom = document.querySelectorAll(".error");
    for (let es of esDom){
        es.addEventListener("click", function (e) {
            e.stopPropagation();
            let type = es.getAttribute("data-type");
            let id = es.getAttribute("data-id");
            window.localStorage.setItem("errorType", type);
            window.localStorage.setItem("errorId", id);
            window.open("/tcm/correction");
        });
    }

    let locationDom = document.querySelectorAll(".location");
    for (let location of locationDom) {
        location.addEventListener("click", function (e) {
            e.stopPropagation();
            if (cube){
                let sid = location.getAttribute("data-sid");
                let node = find3DNodeBySId(sid);
                moveCamera(node);
            }
        })
    }
}

var option;
function dataHisEcharts(){
    var infoBox = document.getElementById('info');
    var chartDom = document.createElement("div");
    chartDom.style.height = "70%"
    chartDom.style.width = "100%"

    infoBox.appendChild(chartDom)
    var myChart1 = echarts.init(chartDom);
    var option;

    let base = +new Date(2012, 1, 1);
    let oneDay = 24 * 3600 * 1000;
    let date = [];
    let data = [Math.random() * 300];
    for (let i = 1; i < 4000; i++) {
        var now = new Date((base += oneDay));
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        var randomData = (Math.random() - 0.5) * 20 + data[i - 1];
        if ( randomData > 0){
            data.push(randomData);
        }else{
            data.push(0-randomData);
        }
    }
    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '新能源汽车销量趋势图'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: [
            {
                name: 'Data',
                type: 'line',
                symbol: 'none',
                sampling: 'lttb',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
                data: data
            }
        ]
    };

    option && myChart1.setOption(option);
}

function dataHisEchartsByClick(name){
    var chartDom = document.getElementById('info');
    var myChart1 = echarts.init(chartDom);
    var option;

    let base = +new Date(2012, 1, 1);
    let oneDay = 24 * 3600 * 1000;
    let date = [];
    let data = [Math.random() * 300];
    for (let i = 1; i < 4000; i++) {
        var now = new Date((base += oneDay));
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        var randomData = (Math.random() - 0.5) * 20 + data[i - 1];
        if ( randomData > 0){
            data.push(randomData);
        }else{
            data.push(0-randomData);
        }
    }
    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: name+'趋势图'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: [
            {
                name: 'Data',
                type: 'line',
                symbol: 'none',
                sampling: 'lttb',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 158, 68)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(255, 70, 131)'
                        }
                    ])
                },
                data: data
            }
        ]
    };

    option && myChart1.setOption(option);
}