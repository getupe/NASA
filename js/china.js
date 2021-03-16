// excel表
let excela1 = [], excelb1 = [], excela2 = [], excelb2 = [],
 excela3 = [], excelb3 = [],excela4 = [], excelb4 = [], excela5 = [], 
 excelb5 = [], excela6 = [], excelb6 = [],excel7=[],
 excela7 = [], excelb7 = [],
 excela8 = [], excelb8 = [];
var typeChart = null, attackChart = null, right3Chart1 = null, right3Chart2 = null, right3Chart3 = null, rEcharts = null;

var jsonData = null;

$(function () {
    datarush();
    // 右上角时间
    setInterval(function() {
        showTime();
    }, 1000); 
    getTitle(); 
    listBoxAdd();  
    // scroll
    var $this = $(".prize-databox"), scrollTimer;
    $this.hover(function () {
        clearInterval(scrollTimer);
    }, function () {
        scrollTimer = setInterval(function () {
            scrollNews($this);
        }, 800);
    }).trigger("mouseout");
    // 去年病毒类型统计
    $('#typeSta').click(function() {
        $('#typeChart').show();
        typeChart = echarts.init(document.getElementById('typeChartPanel'));
        typeChart.setOption(DrawtrendPop(jsonData.bdgrcs));         
    });  

    // 去年APT攻击行业占比分析
    $('#attackHY').click(function() {
        $('#attackChart').show();
        attackChart = echarts.init(document.getElementById('attackChartPanel'));
        attackChart.setOption(Drawzlbute1Pop(jsonData.aptgjhyzbfx));        
    });  
    // 去年被控网络主机分布前10 雷达图
    $('#controlled').click(function() {
        showRadar(jsonData.radar);       
    });
    // 
    $('.right3').click(function() {
        $('#right3Charts').show();
        right3Chart1 = echarts.init(document.getElementById('rightC1'));
        right3Chart1.setOption(DrawWarntrend3Pop(jsonData.bkjszjslbhqsTop10));  
        right3Chart2 = echarts.init(document.getElementById('rightC2'));
        right3Chart2.setOption(DrawWarntrend11Pop(jsonData.eycxcbcs)); 
        right3Chart3 = echarts.init(document.getElementById('rightC3'));
        right3Chart3.setOption(DrawWarntrend2Pop(jsonData.webyygjbhqs));    
    });
    $('.closeBtn').click(function() {
        hideRadar();
    });
});
function getTitle() {
    $.ajax({
        url: "../data/titleConfig.json",
        type:"get",
        dataType:"json",
        success:function(data){
            const config = data.china;
            const lastYear = new Date().getFullYear() - 1;

            $('#headerTitle')[0].innerHTML = config.headerTitle;
            
            $('#typeSta .lastYear')[0].innerHTML = config.leftTop.replace('%lastYear%',lastYear);
            $('#attackHY .lastYear')[0].innerHTML = config.leftMedium.replace('%lastYear%',lastYear);
            $('#controlled .lastYear')[0].innerHTML = config.leftBottom.replace('%lastYear%',lastYear);

            $('#zjsl .lastYear')[0].innerHTML = config.rightTop.replace('%lastYear%',lastYear);
            $('#jjfw .lastYear')[0].innerHTML = config.rightMedium.replace('%lastYear%',lastYear);
            $('#yygj .lastYear')[0].innerHTML = config.rightBottom.replace('%lastYear%',lastYear);

            $('#bkzjP')[0].innerHTML = config.leftTopP.replace('%lastYear%',lastYear);
            $('#bdlxtjP')[0].innerHTML = config.leftMediumP.replace('%lastYear%',lastYear);
            $('#APThyzbP')[0].innerHTML = config.leftBottomP.replace('%lastYear%',lastYear);

            $('#jszjP')[0].innerHTML = config.rightTopP.replace('%lastYear%',lastYear);
            $('#fbsjjfwP')[0].innerHTML = config.rightMediumP.replace('%lastYear%',lastYear);
            $('#yygjP')[0].innerHTML = config.rightBottomP.replace('%lastYear%',lastYear);
        }
    });
}
// 修改时间
function showTime() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hour = add0(time.getHours());
    let minute = add0(time.getMinutes())
    let second = add0(time.getSeconds());    

    function add0(num) {
        if(num < 10) {
            return `0${num}`;
        }
        return num.toString();
    }
    let timeText = `${year}年${month}月${date}日   ${hour}:${minute}:${second}`;
    $('#systemTime').text(timeText);
}
// 雷达图
function showRadar(data) {    
    $('#radarChart').show();
    rEcharts = echarts.init(document.getElementById('rChartPanel'));
    let indicator = [], value = [], max = 0;

    data.sort((front, next) => front - next);
    for(let i=0;i<data.length;i++) {
        let {province, percent} = data[i];
        let per = Number(percent.split('%')[0]);
        value.push(per);
        if(per > max) {
            max = per;
        }
        let item = {name: province + '  ' + percent};
        if(province === '天津') {
            item = {...item, color: '#f52b2b'}
        }
        indicator.push(item);
    }
    for(let j=0;j<indicator.length;j++) {
        indicator[j]['max'] = max + 0.5;
    }    
    const lastYear = new Date().getFullYear() - 1;
    const name = `${lastYear}年被控主机分布雷达图`;
    let option = {
        radar: {
            indicator,
            radius: 320,
            shape: 'circle',
            name: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: 22
                },
            },
            splitArea: {
                areaStyle: {
                    opacity: 0
                }
            },
            axisLine: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#00ffff',
                    type: 'dotted',
                    width: 2
                }
            }
        },
        series: [{
            name,
            type: 'radar',
            lineStyle: {
                width: 6,
                color: '#00ffff'
            },
            symbol: 'none',                
            data: [
                {
                    value,
                    label: {
                        show: true,
                        fontSize: 22,
                        color:'#00ffff',
                        formatter: '{c}%'
                    }
                }
            ],
            animation: true,
            animationDuration: 2000
        }]
    };
    rEcharts.setOption(option);
}
function hideRadar(){
    $('#radarChart').hide();
    if(rEcharts) {
        echarts.dispose(rEcharts);
    }
    $('#typeChart').hide();
    if(typeChart) {
        echarts.dispose(typeChart);
    }
    $('#attackChart').hide();
    if(attackChart) {
        echarts.dispose(attackChart);
    }
    $('#right3Charts').hide();
    if(right3Chart1) {
        echarts.dispose(right3Chart1);
    }
    if(right3Chart2) {
        echarts.dispose(right3Chart2);
    }
    if(right3Chart3) {
        echarts.dispose(right3Chart3);
    }
}
function getLastWeekTime(days, hours, minutes, seconds) {
    var todayTime = new Date().getTime();
    var oneSecond = 1000;
    var oneMinute = 60 * oneSecond;
    var oneHour = 60 * oneMinute;
    var oneDay = 24 * oneHour;
    var lastWeekDay = new Date((todayTime + days * oneDay + hours * oneHour + minutes * oneMinute + seconds * oneSecond));
    var lastWeekYear = lastWeekDay.getFullYear();
    var lastWeekMonth = lastWeekDay.getMonth() + 1;
    var lastWeekDate = lastWeekDay.getDate();
    var lastWeekHours = lastWeekDay.getHours()<10?"0"+lastWeekDay.getHours():lastWeekDay.getHours();
    var lastWeekSeconds = lastWeekDay.getSeconds()<10?"0"+lastWeekDay.getSeconds():lastWeekDay.getSeconds();
    var lastWeekMinutes = lastWeekDay.getMinutes()<10?"0"+lastWeekDay.getMinutes():lastWeekDay.getMinutes();
    return lastWeekYear + "/" + lastWeekMonth + "/" + lastWeekDate + " " + lastWeekHours + ":" + lastWeekMinutes + ":" + lastWeekSeconds;
  }

//无缝滚动
function scrollNews (obj) {
    var $self = obj.find("ul:first");
    var lineHeight = $self.find("li:first").height();
    $self.animate({ "margin-top": -lineHeight + "px" }, 800, "linear", function () {
        $self.css({ "margin-top": "0px" }).find("li:first").appendTo($self);
    })
}
// 地图刷新
function chartRefresh(attackInfo) {
    let scatterData = [];
    for(let i=0;i<attackInfo.length;i++) {
        const {target, targetLongitude, targetLatitude, typeColor} = attackInfo[i];
        scatterData.push({
            name: target,
            value: [targetLongitude, targetLatitude],
            itemStyle: {color: typeColor} //#f12929' , '#f16029', '#f1e229', '#d800ff'
        });
    }
    $.ajax({
        url: "../data/jsonData.json",
        type: "get",
        dataType: "json",
        success: function (data) {
            let mapData = [];
            for(let i=0;i<data.radar.length;i++) {
                mapData.push({
                    name: data.radar[i]['province'],
                    value: Number(data.radar[i]['percent'].split('%')[0])
                });
            }
            var waitSec = 10, scatterDatas = [scatterData[0]];
            myChart2 = echarts.init(document.getElementById('cnterEcharsC1'));
            drwareaz(scatterDatas, mapData);
            let index = 1;
            setInterval(function() {
                if (index === scatterData.length){
                    index = 0;
                }
                scatterDatas.push(scatterData[index]);
                index ++;
                drwareaz(scatterDatas.slice(-1*waitSec*2), mapData);
            }, 3000);
        }
    });     
}

function datarush () {
    $.ajax({
        url: "../data/jsonData.json",
        type: "get",
        dataType: "json",
        success: function (data) {
            jsonData = data;
            let echarslm = echarts.init(document.getElementById('echarslm'));
            echarslm.setOption(DrawWarntrend11(data.eycxcbcs));
            let echarslet = echarts.init(document.getElementById('echarslet'));
            echarslet.setOption(Drawtrend(data.bdgrcs));
            var echarsr = echarts.init(document.getElementById('echarsr'));
            echarsr.setOption(DrawWarntrend((data.bkzjfbTop10)));
            let echarslem = echarts.init(document.getElementById('echarslem'));
            echarslem.setOption(Drawzlbute1(data.aptgjhyzbfx));
            let echarsrm = echarts.init(document.getElementById('echarsrm'));
            echarsrm.setOption(DrawWarntrend2(data.webyygjbhqs));
            var echarsrt = echarts.init(document.getElementById('echarsrt'));
            echarsrt.setOption(DrawWarntrend3(data.bkjszjslbhqsTop10));
        }
    });
}

// 感染恶意程序主机分布
function Drawtrend (data) {
    var option = {
        color: ['#009dff'],
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
            show:true,
            borderColor: '#4e4e50'
        },
        yAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        xAxis: [{
            type: 'value',
            name: '',
            position: 'top',
            axisLabel: {

                formatter: '{value}% ',
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            interval: 10,
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 12, //柱子宽度
            barGap: 15, //柱子之间间距
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0,0,1,0,[{
                        offset: 0,
                        color: '#009dff00'
                    },{
                        offset: 1,
                        color: '#009dff'
                    }])
                }
            },
            "label": {
                "normal": {
                    "show": false,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    return option;
}
// 
function DrawtrendPop (data) {
    var option = {
        color: ['#009dff'],
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
            show:true,
            borderColor: '#4e4e50'
        },
        yAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '20',
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        xAxis: [{
            type: 'value',
            name: '',
            position: 'top',
            axisLabel: {
                formatter: '{value}% ',
                fontSize: '20',
                textStyle: {
                    color: "#ffffff",
                }
            },
            //max: data[1][0],
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            interval: 10,
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 25, //柱子宽度
            barGap: 15, //柱子之间间距
            itemStyle: {
                normal: {
                    color: '#00ffff'
                }
            },
            "label": {
                "normal": {
                    "show": false,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    return option;
}
var dearyy = [];
var myChart2, timeFn, allData;

function drwareaz (scatter, mapData) {
    $('#cnterEcharsC1').show();
    myChart2.setOption(getcenechars1(scatter, mapData));
    myChart2.on('click', function (params) {
        // if (params.name == "天津") {
          window.location.href = 'province.html'
        // }
    });
}
function listBoxAdd() {
    $.ajax({
        url: "/api/load-china-data",
        type: "get",
        dataType: "json",
        success: function (data) {
            var attackHtml = '';
            var iconTypeMap = {
                '漏洞攻击': 'attackld',
                '木马攻击': 'attackmm',
                '恶意程序': 'attackey',
                '网站后门': 'attackhm'
            };
            var conTypeMap =  {
                '希腊': 'GR',
                '匈牙利': 'HU',
                '波兰': 'PT',
                '奥地利': 'AT',
                '加拿大': 'CA',
                '德国': 'DE',
                '丹麦': 'DK',
                '以色列': 'IL',
                '俄罗斯': 'RU',
                '乌克兰': 'UA',
                '意大利': 'IT',
                '墨西哥': 'MX',
                '印度': 'IN',
                '挪威': 'NO',
                '西班牙': 'ES',
                '捷克': 'CZ',
                '法国': 'FR',
                '瑞典': 'SE',
                '芬兰': 'FI',
                '瑞士': 'CH',
                '比利时': 'BE',
                '英国': 'GB',
                '葡萄牙': 'PT',
                '美国': 'US',
                '古巴': 'CU',
                '巴西': 'BR',
                '埃及': 'EG',
                '澳大利亚': 'AU',
                '荷兰': 'NL',
                '卢森堡': 'LU',
                '爱尔兰': 'IE',
                '冰岛': 'IS',
                '日本': 'JP'
            };

            const attackInfo = data.attackInfo;
            for(var p=0;p<attackInfo.length;p++) {
                let className = attackInfo[p][2] === "天津" ? "highLine" : "";
                let {attackType, source, target, attackTime} = attackInfo[p];
                attackHtml += "<li class='" + className + "'>" +
                    "<span><img class = 'attackIcon' src='../style/images/attack/" + iconTypeMap[attackType] + ".png'>" + attackType + "</span>" +
                    "<span class = 'secCol'><img class = 'countryIcon' src='../style/images/country/" + conTypeMap[source] + ".svg'>" + source + "</span>" +
                    "<span>" + target + "</span>" +
                    "<span>" + attackTime + "</span>"
                "</li>";
            }
            document.getElementById('chinaListBox').innerHTML = attackHtml;
            chartRefresh(attackInfo);
        }
    });
}
// APT攻击威胁监测
function DrawWarntrend (data) {
    var option = {
        color: ['#009dff'],
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '-20',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: true,                
                lineStyle: {
                    color: "#4e4e50",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                },
                rotate: 30,
                align: 'center',
                margin: 30
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 16, //柱子宽度
            barGap: 33, //柱子之间间距
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0,1,0,0,[{
                        offset: 0,
                        color: '#009dff00'
                    },{
                        offset: 1,
                        color: '#009dff'
                    }])
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    color: '#6af3ff',
                    "position": "top",
                    "formatter": "{c}%"
                }
            }

        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    return option;
}

// 近半年网络攻击趋势
function DrawWarntrend11 (data) {
    // 使用刚指定的配置项和数据显示图表。
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                },
                interval: 30,
                formatter: function(value) {
                    let month = Number(value.trim().slice(4,6));
                    return month + '月';
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                formatter: '{value} ',
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#ffffff22'
                }
            },
            splitNumber: 10,
        }],

        series: [{
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: "#e4007f",
                    borderColor: "",
                    borderWidth: "2"
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: "#009dff"
                }
            },
            data: data[1]
        }]
    };
    return option;
}
// 
function DrawWarntrend11Pop (data) {
    // 使用刚指定的配置项和数据显示图表。
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '16',
                textStyle: {
                    color: "#ffffff",
                },
                interval: 30,
                formatter: function(value) {
                    let month = Number(value.trim().slice(4,6));
                    return month + '月';
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                formatter: '{value} ',
                fontSize: '16',
                textStyle: {
                    color: "#ffffff",
                }
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#ffffff22'
                }
            },
            splitNumber: 10,
        }],

        series: [{
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: "#e4007f",
                    borderColor: "",
                    borderWidth: "2"
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: "#009dff"
                }
            },
            data: data[1]
        }]
    };
    return option;
}

function DrawWarntrend2 (data) {

    var option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                },
                interval: 30,
                formatter: function(value) {
                    let month = Number(value.trim().slice(4,6));
                    return month + '月';
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                formatter: '{value} ',
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#ffffff22'
                }
            },
            splitNumber: 10,
        }],

        series: [{
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: "#e4007f",
                    borderColor: "",
                    borderWidth: "2"
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: "#009dff"
                }
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0,1,0,0,[{
                    offset: 0,
                    color: '#0336ff'
                },{
                    offset: 1,
                    color: '#01b4ff'
                }]),
                opacity: 0.4
            },
            data: data[1]
        }]
    };
    return option;
}
// 
function DrawWarntrend2Pop (data) {

    var option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: '16',
                textStyle: {
                    color: "#ffffff",
                },
                interval: 30,
                formatter: function(value) {
                    let month = Number(value.trim().slice(4,6));
                    return month + '月';
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                formatter: '{value} ',
                fontSize: '16',
                textStyle: {
                    color: "#ffffff",
                }
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color: '#ffffff22'
                }
            },
            splitNumber: 10,
        }],

        series: [{
            type: 'line',
            smooth: 0.6,
            symbol: 'none',
            itemStyle: {
                normal: {
                    color: "#e4007f",
                    borderColor: "",
                    borderWidth: "2"
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: "#009dff"
                }
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0,1,0,0,[{
                    offset: 0,
                    color: '#0336ff'
                },{
                    offset: 1,
                    color: '#01b4ff'
                }]),
                opacity: 0.4
            },
            data: data[1]
        }]
    };
    return option;
}

function Drawzlbute1 (data) {
    var option = {
        color: ['#009dff'],
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
            show:true,
            borderColor: '#ffffff4d'
        },
        yAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                show: true,
                interval: 0,
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        xAxis: [{
            type: 'value',
            name: '',
            position: 'top',
            axisLabel: {

                formatter: '{value}%',
                fontSize: '14',
                textStyle: {
                    color: "#ffffff",
                }
            },
            //max: data[1][0],
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            interval: 10,
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 8, //柱子宽度
            barGap: 8, //柱子之间间距
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0,0,1,0,[{
                        offset: 0,
                        color: '#009dff00'
                    },{
                        offset: 1,
                        color: '#009dff'
                    }])
                }
            },
            "label": {
                "normal": {
                    "show": false,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };

    return option;
}
function Drawzlbute1Pop(data) {
    var option = {
        color: ['#009dff'],
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
            show:true,
            borderColor: '#ffffff4d'
        },
        yAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                show: true,
                interval: 0,
                fontSize: '20',
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        xAxis: [{
            type: 'value',
            name: '',
            position: 'top',
            axisLabel: {

                formatter: '{value}%',
                fontSize: '20',
                textStyle: {
                    color: "#ffffff",
                }
            },
            //max: data[1][0],
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#00c7ff",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            interval: 10,
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 20, //柱子宽度
            barGap: 8, //柱子之间间距
            itemStyle: {
                normal: {
                    color: '#00ffff'
                    // color: new echarts.graphic.LinearGradient(0,0,1,0,[{
                    //     offset: 0,
                    //     color: '#009dff00'
                    // },{
                    //     offset: 1,
                    //     color: '#009dff'
                    // }])
                }
            },
            "label": {
                "normal": {
                    "show": false,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };

    return option;
}
function DrawWarntrend3 (data) {
    var option = {
        color: ['#009dff'],
        title: {
            text: '单位：万台',
            textStyle: {
                color: '#ffffff',
                fontSize: 14
            }
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: true,                
                lineStyle: {
                    color: "#4e4e50",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: 14,
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            //position: 'top',
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 16, //柱子宽度
            barGap: 24, //柱子之间间距
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0,1,0,0,[{
                        offset: 0,
                        color: '#009dff00'
                    },{
                        offset: 1,
                        color: '#009dff'
                    }])
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    color: '#6af3ff',
                    fontSize: 14,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    return option
}
// 
function DrawWarntrend3Pop (data) {
    var option = {
        color: ['#009dff'],
        title: {
            text: '单位：万台',
            textStyle: {
                color: '#ffffff',
                fontSize: 14
            }
        },
        grid: {
            top: '20',
            left: '20',
            right: '32',
            bottom: '10',
            containLabel: true,
        },
        xAxis: [{
            type: 'category',
            data: data[0],
            axisLine: {
                show: true,                
                lineStyle: {
                    color: "#4e4e50",
                    width: 1,
                    type: "solid"
                },
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true,
                interval: 0,
                fontSize: 16,
                textStyle: {
                    color: "#ffffff",
                }
            },
        }],
        yAxis: [{
            type: 'value',
            name: '',
            //position: 'top',
            axisLabel: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: '#ffffff33'
                }
            },
        }],
        series: [{
            type: 'bar',
            data: data[1],

            barWidth: 20, //柱子宽度
            barGap: 24, //柱子之间间距
            itemStyle: {
                normal: {
                    color: '#009dff'
                    // color: new echarts.graphic.LinearGradient(0,1,0,0,[{
                    //     offset: 0,
                    //     color: '#009dff00'
                    // },{
                    //     offset: 1,
                    //     color: '#009dff'
                    // }])
                }
            },
            "label": {
                "normal": {
                    "show": true,
                    color: '#6af3ff',
                    fontSize: 14,
                    "position": "top",
                    "formatter": "{c}"
                }
            }

        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    return option
}
// map  网络攻击分布---中国地图
function getcenechars1 (scatter, mapData) {
    var option = {
        visualMap: {
            type: 'piecewise',
            splitNumber: 4,
            precision: 1,
            pieces: [
                {gt: 3},
                {gt: 2, lte: 3},
                {gt: 1, lte: 2},
                {lte: 1}
            ],
            seriesIndex: 0,
            formatter: function(min, max) {
                if(max === 1) {
                    return '轻微';
                }else if(max === 2) {
                    return '一般';
                }else if(max === 3) {
                    return '严重';
                }else if(min === 3) {
                    return '危险';
                }
            },
            color: ['#943838' , '#8a513b', '#888233', '#456baf'],
            top: 10,
            left: 10,
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: "china",
            roam: false, //是否允许缩放  
            zoom: 1.2,           
        },
        series: [{
            type: 'map',
            map: 'china',
            geoIndex: 0,
            data: mapData
        }, {
            type: 'effectScatter',
            coordinateSystem:'geo',
            symbolSize: 8,
            rippleEffect: {
                brushType: 'stroke',
                scale: 5
            },
            emphasis:{
                itemStyle:{
                    color:'red'
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: '{b}'
            },
            data: scatter || []
        }
    ]};
    return option;
}
// 全国个省份页面，点击中国按钮，跳转到中国页面
function jumpBack(html) {
    if(html === 'world') {
        window.location.href = '../html/world.html';
    }else if(html === 'index') {
        window.location.href = '../index.html';
    }    
}