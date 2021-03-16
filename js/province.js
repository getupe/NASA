$(function() {
    setInterval(function() {
        showTime();
    }, 1000); 
    getTitle(); 
    getData(); 
    addJumpEvent();
    let tjChart = echarts.init(document.getElementById('tjChart'));
    drawChart(tjChart);
});
// 右上角时间
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
    $('#systemTimeTJ').text(timeText);
}
// 
function getTitle() {
    $.ajax({
        url: "../data/titleConfig.json",
        type:"get",
        dataType:"json",
        success:function(data){
            const config = data.province;
            
            $('#headerTitle')[0].innerHTML = config.headerTitle;
            const lastYear = new Date().getFullYear() - 1;
            
            $('#wlgjT')[0].innerHTML = config.leftTop.replace('%lastYear%',lastYear);
            $('#bzrmmT')[0].innerHTML = config.leftBottom.replace('%lastYear%',lastYear);

            $('#hmwzT')[0].innerHTML = config.center.replace('%lastYear%',lastYear);

            $('#bcgwzT')[0].innerHTML = config.rightTop.replace('%lastYear%',lastYear);
            $('#DDOSgjT')[0].innerHTML = config.rightBottom.replace('%lastYear%',lastYear);
        }
    });
}
function getData() {
    $.ajax({
        url: "../data/jsonData.json",
        type:"get",
        dataType:"json",
        success:function(res){
            const data = res.provinceData;
            $('#tjAttack .num')[0].innerHTML = data.wlgj;
            $('#tjMm .num')[0].innerHTML = data.bzrmm;
            $('#tjBackdoor .value')[0].innerHTML = data.bzrhmwz;
            $('#tjWeb .num')[0].innerHTML = data.bcgwz;
            $('#tjDDOS .num')[0].innerHTML = data.DDOS;
        }
    });
}
// 左上角面包屑跳转页面事件
function addJumpEvent() {
    $('#toIndexBtn').on('click', jump('../index.html'));
    $('#toWorldBtn').on('click', jump('../html/world.html'));
    $('#toChinaBtn').on('click', jump('../html/china.html'));
    function jump(linkUrl) {
        return function() {
            window.location.href = linkUrl;
        };        
    }
}
// 画地图
function drawChart(chart) {
    let option = {
        geo: [{
            map: "guizhou",
            roam: false, //是否允许缩放  
            zoom: 1.22,   
            itemStyle: {
                areaColor: '#2294ff'
            }
        }, {
            map: "guizhou",
            roam: false, //是否允许缩放  
            zoom: 1.2,   
            regions: [{
                name: '贵阳市',
                itemStyle: {
                    areaColor: '#01649d',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '六盘水市',
                itemStyle: {
                    areaColor: '#01649d',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '遵义市',
                itemStyle: {
                    areaColor: '#018ec3',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '安顺市',
                itemStyle: {
                    areaColor: '#013f60',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '毕节市',
                itemStyle: {
                    areaColor: '#0187af',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '铜仁市',
                itemStyle: {
                    areaColor: '#01649d',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '黔西南布依族苗族自治州',
                itemStyle: {
                    areaColor: '#018ec3',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '黔东南苗族侗族自治州',
                itemStyle: {
                    areaColor: '#013f60',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            },{
                name: '黔南布依族苗族自治州',
                itemStyle: {
                    areaColor: '#0187af',
                },
                label: {
                    show: true,
                    color: '#e4eff5',
                },
            }]   
        }],
        series: [{
            type: 'map',
            geoIndex: 1,
            data: null
        }
    ]};
    chart.setOption(option);
}