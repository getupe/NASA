
  addListener();
  // 
  function addListener() {
      $("#listPopBox").click(function() {
        $('#listPop').show();
      });    
      $('.closeBtn').click(function() {
        $('#listPop').hide();
      });
  }
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
      // 滚动
  $(function () {
    //  右上角时间
    setInterval(function() {
      showTime();
    }, 1000); 
    getTitle();
  });
  function getTitle() {
    $.ajax({
        url: "../data/titleConfig.json",
        type:"get",
        dataType:"json",
        success:function(data){
            const config = data.home;
            const lastYear = new Date().getFullYear() - 1;

            $('#headerTitle')[0].innerHTML = config.headerTitle;
            
            $('#bgjdq')[0].innerHTML = config.leftTop.replace('%lastYear%',lastYear);
            $('#gjy')[0].innerHTML = config.leftBottom.replace('%lastYear%',lastYear);

            $('#gjsjhf')[0].innerHTML = config.right.replace('%lastYear%',lastYear);

            $('#bgjdqP')[0].innerHTML = config.leftLP.replace('%lastYear%',lastYear);
            $('#bgjyP')[0].innerHTML = config.leftRP.replace('%lastYear%',lastYear);
        }
    });
  }
      var marginTop = 0, scrollMax = 0, scrollData = [];
      function scrolling (obj) {
          var $self = obj.find("ul:first");
          let lineHeight = $self.find("li:first").height();

          if(-marginTop >= scrollMax*lineHeight) {
                $self.css({ "margin-top": "0px" });
                marginTop = 0;
          }else {
              $self.animate({ "margin-top": marginTop + "px" }, 800, "linear");
              marginTop = marginTop - lineHeight; 
          }   
      }

      var initData = {};
      var routes = [];
      var chart = echarts.init(document.getElementById('cnterEchars'));

  loadData();

  function loadData() {
    getJsonData();
          let dataString = $.ajax({
            url: "/api/load-data",
            type: "get",
            dataType: "json",
            async: false
          }).responseText;

          data = JSON.parse(dataString);

          // 如果 routes 没有数据，则不做清空操作
          if (data.routes.length == 0) {
            loadData();
            return;
          }
          initData = {}; // 执行清空操作
          initData = data;
          // 右列滚动列表
          var $this = $("#attackList"), scrollTimer;
          $this.hover(function () {
              clearInterval(scrollTimer);
          }, function () {
              scrollTimer = setInterval(function () {
                  scrolling($this);
              }, 800);
          }).trigger("mouseout");
          let airports = data.airports;
          let airlines = data.airlines;

          scrollMax = data.routes.length;
          routes = data.routes.map(function (item) {
            return {
              coordinate: {
                coords: [
                  [
                    airports[item[1]][3], // 获取攻击源经度
                    airports[item[1]][4], // 获取攻击源纬度
                  ],
                  [
                    airports[item[2]][3], // 获取攻击目标经度
                    airports[item[2]][4], // 获取攻击目标纬度
                  ]
                ]
              },
              typeColor: airlines[item[0]][1], // 获取颜色
            }
          });
          loadMap();
  }


  function getJsonData() {
    $.ajax({
      url: "../data/jsonData.json",
      type: "get",
      dataType: "json",
      success: function (data) {
        const imgUrl = {
          '中国': 'China',
          '德国': 'Germany',
          '俄罗斯': 'Russia',
          '加拿大': 'Canada',
          '日本': 'Japan',
          '澳大利亚': 'Australia',
          '伊朗': 'Iran',
          '以色列': 'Israel',
          '英国': 'England',
          '乌克兰': 'Ukraine',
          '美国': 'America',
        }
        const attactedTop10 = document.getElementById('attactedTop10');
        const attactSourceTop10 = document.getElementById('attactSourceTop10');
        const attactedTop10P = document.getElementById('attactedTop10P');
        const attactSourceTop10P = document.getElementById('attactSourceTop10P');

        loadAttack10(data.attactedTop10, attactedTop10, imgUrl);
        loadAttack10(data.attactSourceTop10, attactSourceTop10, imgUrl);        
        loadAttack10(data.attactedTop10, attactedTop10P, imgUrl);        
        loadAttack10(data.attactSourceTop10, attactSourceTop10P, imgUrl);        
      }
    });     
  }
  function loadAttack10(data, element, imgUrl) {
    let attactedHTML = '';
    
    for(let i=0;i<data.length;i++) {
      const {name, rate} = data[i];
      attactedHTML += `
        <li>
          <div class="right-content">
            <img class="img-country" src="style/images/country/${imgUrl[name]}.png">
            <span>${name}</span>
          </div>
          <div class="left-content">
            <span>${rate}</span>
          </div>
        </li>
      `;
    }
    element.innerHTML = attactedHTML;
  }

      drwareas();

      function addScrollHTML(data) {
        var htmlStr = " ";
        data.routes.forEach(function (r, index) {
          let typeIconMap = {
            "网站后门": 'attackhm',
            "恶意程序": 'attackey',
            "漏洞攻击": 'attackld',
            "木马攻击": 'attackmm'
          };
              htmlStr += '<li>'+
                    '<div class="img-box">'+
                      '<img src="style/images/attack/'+typeIconMap[data.airlines[r[0]][0]]+'.png" class="circle">'+
                    '</div>'+
                    '<p class="first">'+
                      '<span>'+data.airlines[r[0]][0]+'</span>'+
                      '<span class="day">'+r[3].split(' ')[0]+'</span>'+
                    '</p>'+
                    '<p class="second">'+
                      '<span class="head-top">'+
                        '<span>'+data.airports[r[1]][2]+'</span>'+
                        '<img src="style/images/index/arrow.png" class="img">'+
                      '</span>'+
                      '<span class="day">'+r[3].split(' ')[1]+'</span>'+
                    '</p>'+
                    '<p class="three"><span>'+data.airports[r[2]][2]+'</span></p>'+
                  '</li>'
            });
            document.getElementById('attackList').innerHTML = '<ul class="newlist" id="my_ul">'+htmlStr+'</ul>';
      }
      
      function drwareas() {
          // 滚动列表
          addScrollHTML(initData);

          $.ajax({
            url: "data/jsonData.json",
            type: "get",
            dataType: "json",
            success: function (data) {
              let myChart2 = echarts.init(document.getElementById('thumbnail'));
              myChart2.setOption(getcenechars(data.mapd));
              myChart2.on('click', function (params) {
                if (params.name == "China") {
                  window.location.href = 'html/china.html'
                }
              });
            }
          })
      }

    function loadMap() {
      // 首次调用，直接执行，防止延时
      intervalFunction();
      // 注意这里调用方法不需要括号
      // self.setInterval(intervalFunction, 3000);
    }


    function intervalFunction() {
      if (routes.length == 1 || routes.length == 0) {
        loadData();
      } else {
        let series = [];
        // for (i = 0; i < 20; i++) {
        //   let route = routes.pop();
        //   let line = buildLineData(route);
        //   series.push(line)
        // };
        for (i = 0; i < 50; i++) {
          let route = routes[i];
          let line = buildLineData(route);
          series.push(line)
        };
        buildOptionData(series);
      }
    }
    function buildLineData(routeData) {
      if (routeData == null) {
        return;
      }
      let line = {
        name: 'lines3D',
        type: 'lines3D',
        coordinateSystem: 'globe',
        effect: {
          show: true,
          period: 2, // 控制线条攻击速度
          trailWidth: 3, // 控制攻击线条宽度
          trailLength: 0.5,
          trailOpacity: 1,
          trailColor: routeData.typeColor // 控制攻击线条颜色
        },
        blendMode: 'lighter',
        lineStyle: {
          width: 1,
          color: '#0087f4',
          opacity: 0 // 是否始终显示轨迹线
        },

        data: [routeData.coordinate]
      };

      return line;
    }

    function buildOptionData(series) {
      let option = {
        backgroundColor: '',
        globe: {
          globeRadius: 60,
          baseTexture: 'style/images/index/earth.jpg',
          shading: 'lambert',
          light: {
            ambient: {
              intensity: 0.4
            },
            main: {
              intensity: 0.4
            }
          },
          viewControl: {
            alpha: 30,
          }
        },
        series: series
      };
      chart.setOption(option);
    }


    // 调用地图
    function getcenechars(data) {
      var geoCoordMap = data.geoCoordMap;
      var BJData = data.BJDate;
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var dataItem = data[i];
          var fromCoord = geoCoordMap[dataItem.sourceCity];
          var toCoord = geoCoordMap[dataItem.desCity];
          if (fromCoord && toCoord) {
            res.push([{
              name: dataItem.sourceCity,
              coord: fromCoord,
              value: dataItem.value,

              lineStyle: {
                width: 1 // 线的宽度
              }
            },
            {
              name: dataItem.desCity,
              coord: toCoord
            }
            ]);
          }
        }
        return res;
      };
      // line
      var series = [];
      [
        ["北京", BJData]
      ].forEach(function (item, i) {
        var de0 = item[1].filter(item => {
          return item.type == 0;
        })
        var de1 = item[1].filter(item => {
          return item.type == 1;
        })
        var de2 = item[1].filter(item => {
          return item.type == 2;
        })
        series.push({
          name: "攻击线1",
          type: "lines",
          zlevel: 2,
          effect: {
            show: true,
            period: 2, //箭头指向速度，值越小速度越快
            trailLength: 1, //特效尾迹长度[0,1]值越大，尾迹越长重
            symbol: "arrow", //箭头图标
            symbolSize: 3, //图标大小
            color: "#ffffff"
          },
          lineStyle: {
            normal: {
              width: 0, //尾迹线条宽度
              opacity: .5, //尾迹线条透明度
              curveness: .2, //尾迹线条曲直度
            }
          },
          data: convertData(de1)
        },
          // line1
          {
            name: "攻击线1",
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              period: 1.5,
              trailLength: 1,
              symbol: "arrow",
              symbolSize: 3,
              color: "#ffffff"
            },
            lineStyle: {
              normal: {
                width: 1,
                opacity: .5,
                curveness: .2
              }
            },
            data: convertData(de2)
          },
          // arrow 
          {
            name: "攻击线1",
            type: "lines",
            zlevel: 2,
            effect: {
              show: true,
              period: 1,
              trailLength: 0.2,
              symbol: "arrow",
              symbolSize: 3,
              color: "#ffffff"
            },
            lineStyle: {
              normal: {
                width: 1,
                opacity: .5,
                curveness: .2
              }
            },
            data: convertData(de0)
          }, {
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          ///涟漪特效
          rippleEffect: {
            period: 4, //动画时间，值越小速度越快
            brushType: "stroke", //波纹绘制方式 stroke, fill
            scale: 15 //波纹圆环最大限制，值越大波纹越大
          },
          label: {
            normal: {
              show: true,
              position: "bottom", //显示位置
              offset: [0, 10], //偏移设置
              fontWeight: "lighter",
              fontSize: 12,
              color: "transparent",
              formatter: "{b}" //圆环显示文字
            },
            emphasis: {
              show: false
            },
          },
          symbol: "circle",
          symbolSize: 1, //圆环大小
          itemStyle: {
            normal: {
              color: "#f00"
            }
          },
          data: item[1].map(function (dataItem) {
            if (geoCoordMap[dataItem.sourceCity] != null) {
              return {
                name: dataItem.sourceCity,
                value: geoCoordMap[dataItem.sourceCity].concat([dataItem.value])
              };
            }
          })
        },
          // 北京
          {
            type: "scatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              period: 4,
              brushType: "stroke",
              scale: 4
            },
            label: {
              normal: {
                show: false,
                position: "top",
                color: "#00ffff",
                formatter: "{b}",
                textStyle: {
                  color: "#ffffff"
                }
              },
              emphasis: {
                show: true
              }
            },
            symbol: "path://M1035.690747 460.197628l-201.082549 198.208997 47.496174 280.220819c6.837071 39.602164-19.388216 77.288628-58.527969 84.224787a71.244261 71.244261 0 0 1-46.042884-7.39857L528.657533 883.039085l-248.578723 132.150342a71.640613 71.640613 0 0 1-97.271371-30.585158c-7.36554-14.202611-9.908798-30.45304-7.233423-46.241059l47.430115-280.220819-201.082549-197.944763a73.523284 73.523284 0 0 1-1.222085-103.117563 71.805759 71.805759 0 0 1 41.154542-21.237857l278.007854-40.791221 124.190274-254.457943a71.442437 71.442437 0 0 1 128.847409 0l124.256332 254.722178 277.908766 40.79122c39.403988 5.614986 66.884389 42.475716 61.368491 82.375144-2.212965 15.821048-9.479417 30.48607-20.742418 41.716042z",
            symbolSize: [15, 15],
            itemStyle: {
              normal: {
                show: true,
                color: "red"
              }
            },
            data: [{
              name: "北京",
              value: [116.397128, 39.916527]
            }]
          }, {
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 4,
          rippleEffect: {
            //涟漪特效
            period: 4,
            brushType: "stroke",
            scale: 20
          },
          symbol: "circle",
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: "#f00"
            }
          },
          data: [{
            name: "北京",
            value: [116.397128, 39.916527]
          }]
        }
        );
      });
      //  世界地图逻辑  world
      var option = {
        tooltip: {
          trigger: "item",
          backgroundColor: "#1540a1",
          borderColor: "#FFFFCC",
          showDelay: 0,
          hideDelay: 0,
          enterable: true,
          transitionDuration: 0,
          extraCssText: "z-index:100",
          formatter: function (params, ticket, callback) {
            //根据业务自己拓展要显示的内容
            var res = "";
            var name = params.name;
            var value = params.value[params.seriesIndex + 1];
            if (params.seriesType == "lines") {
              res =
                "<span style='color:#fff;'>" +
                params.data.fromName + "--" +
                params.data.toName +
                "</span><br/>攻击次数：" +
                params.value;
            } else {
              res = name;
            }

            return res;
          }
        },
        grid: {
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%'
        },
        color: "#DC143C", //三种线的颜色
        visualMap: {
          //图例值控制
          min: 0,
          max: 20000,
          show: false,
          calculable: true,
          color: ["#00FA9A", "#ffde00", "#DC143C"], //三种线的颜色
          seriesIndex: [0, 1],
          textStyle: {
            color: "#fff"
          },

        },
        geo: {
          map: "world",
          // zoom: 2,
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false, //是否允许缩放
          layoutCenter: ["50%", "50%"], //地图中心点
          layoutSize: "150%", // 地图大小
          aspectScale: 0.85, // 地图大小
          itemStyle: {
            normal: {
              areaColor: '#264CAC',
              borderColor: '#6FB2EF',
              label: {
                show: true,
                color: '#fff',
                fontSize: '86'
              },
              emphasis: {
                label: {
                  show: true,
                  color: "rgba(37, 43, 61, .5)" //悬浮背景
                }
              },

            }
          },
          // 中国light
          regions: [{
            zoom: 2,
            name: 'China',
            itemStyle: {
              normal: {
                borderColor: '#0066ff',
                borderWidth: 1,
                areaColor: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: '#87CEFA' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#07ffff' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                shadowColor: 'rgba(128, 217, 248, 1)',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 10
              },
              emphasis: {
                areaColor: '#389BB7',
                borderWidth: 0
              }
            }

          }]
        },
        series: series
      };
      return option;
    }

    function fh() {
      location.href = 'html/world.html';
    } 