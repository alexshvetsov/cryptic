
(() => {

  $(() => {
    // get currencies names array from local storge or set array to []
    selectedCurrenciesNameJSON = localStorage.getItem('selectedCurrenciesName') ? localStorage.getItem('selectedCurrenciesName') : [];
    selectedCurrenciesName = localStorage.getItem('selectedCurrenciesName') ? JSON.parse(selectedCurrenciesNameJSON) : [];
    // get currencies symbols array from local storge or set array to []
    selectedCurrenciesSymbolJSON = localStorage.getItem('selectedCurrenciesSymbol') ? localStorage.getItem('selectedCurrenciesSymbol') : [];
    selectedCurrenciesSymbol = localStorage.getItem('selectedCurrenciesSymbol') ? JSON.parse(selectedCurrenciesSymbolJSON) : [];

    let graphArray = [];
    let tempSymbolArr = [];
    let tempNameArr = [];
    let interval;
 

    
    // display currencies or err
    getData("https://api.coingecko.com/api/v3/coins/list")
      .then(arr => {
        $('.mainArea').empty()
        displayDivs(arr)
        $('#spinner').css('display', 'none');
      }).catch(err => alert(err.status + ": " + err.statusText));

    // get promise 
    function getData(url) {
      return new Promise((resolve, reject) => {
        $.getJSON(url, json => resolve(json))
          .fail(err => reject(err));
      });
    };

    //empty main area and display all currencies
    function displayDivs(arr) {
      for (let item of arr) {
        appendCurrency(item);
      };
    };

    //make and append currency
    function appendCurrency(currency) {

      let newCard = `<div id="${currency.symbol}" class="col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 ">
      <div class="card"> <div class="card-body">`
      const headline = `<h5 class="card-title">${currency.symbol}</h5>`
      newCard += headline + boxChecking(currency)
      const name = `<p class="card-text">${currency.name}</p>`
      newCard += name + `<p>
      <a class=" ${currency.id} ${currency.name.toUpperCase().replace(/ /g, "-")}
       showCollapse btn btn-primary" data-toggle="collapse" href="#${currency.name.toUpperCase().replace(/ /g, "-")}" role="button"
          aria-expanded="false" aria-controls="${currency.name.toUpperCase().replace(/ /g, "-")}">
      More Info
      </a></p>
    <div class="collapse" id="${currency.name.toUpperCase().replace(/ /g, "-")}">
    <div class="card card-body"></div></div></div> </div></div>`

      $('.mainArea').append(newCard)
    }

    //check box or dont cehck box
    function boxChecking(currency) {
      for (let i = 0; i < selectedCurrenciesName.length; i++) {
        if (currency.name.toLowerCase().replace(/ /g, "-") === selectedCurrenciesName[i]) {
          return `<label class="switch">
          <input id="${currency.name.toLowerCase().replace(/ /g, "-")}" 
          type="checkbox" class="toggle ${currency.symbol}" checked>
          <span class="slider round"></span>
        </label>`

        }
      }
      return `<label class="switch">
      <input id="${currency.name.toLowerCase().replace(/ /g, "-")}" 
      type="checkbox" class="toggle ${currency.symbol}" >
      <span class="slider round"></span>
    </label>`

    }


    // display collapse or error
    $('main').on('click', 'a.showCollapse', function () {
      let name = $(this.classList[0].toUpperCase()).selector
      let isStorgeExsist = localStorage.getItem(name) ? true : false;

      if (isStorgeExsist) {
        $('#' + this.classList[0].toUpperCase()).empty()
        const storgeObj = JSON.parse(localStorage.getItem(name));
        const newCard = makeCollapseContent(storgeObj)
        $('#' + name).append(newCard)
      } else {
        const spinner =`<img class="spinner" src="./assets//images/spinner.gif" alt="spinner" width="100px" height="120px">`
        $(`#${this.classList[1].toUpperCase().replace(/ /g, "-")}>.card-body`).append(spinner)
        getData('https://api.coingecko.com/api/v3/coins/' + this.classList[0])
          .then(obj => {
            localStorage.setItem(`${obj.name.toUpperCase().replace(/ /g, "-")}`, JSON.stringify(obj));
            $('#' + obj.name.toUpperCase().replace(/ /g, "-")).empty()
            newCard = makeCollapseContent(obj)
            $('#' + obj.name.toUpperCase().replace(/ /g, "-")).append(newCard)
            setTimeout(() => {
              localStorage.removeItem(`${obj.name.toUpperCase().replace(/ /g, "-")}`);
            }, 120000);
          })
          .catch(err => alert(err.status + ": " + err.statusText));
      }
    })
    //make collapse content
    function makeCollapseContent(obj) {
   
      const img = `<img class="thumbnail" height="100px" width="100xp" src="${obj.image.thumb}">`
      const euro = `<p>${isValueUndefind(obj.market_data.current_price.eur)} euro</p>`
      const usd = `<p>${isValueUndefind(obj.market_data.current_price.usd)} usd</p>`
      const nis = `<p>${isValueUndefind(obj.market_data.current_price.ils)} nis</p>`
      const newCard = `<div class="container">${euro}${usd}${nis}${img}</div>`
      return newCard
    }



    // empty main area and display specific currencies
    $('#searchBtn').click(() => {
      $('#spinner').css('display', 'block');
      getData("https://api.coingecko.com/api/v3/coins/list")
        .then(arr =>{
           displaySearcedDivs(arr.slice(500,599))
        
           $('#spinner').css('display', 'none');
          })
        .catch(err => alert(err.status + ": " + err.statusText));

      function displaySearcedDivs(arr) {
        $('.mainArea').empty();
        for (let item of arr) {
          if (item.symbol === $('input[type="search"]').val()) {
            appendCurrency(item)
            return ;
          }
        }
        $('.mainArea').append(`<div>There is no currency by the name "${$('input[type="search"]').val()}</div>"`)
      }
    })

    //append all currencies on home link
    $('#home').click(() => {
      $('#spinner').css('display', 'block');
      $('#searchCurrency').val('')
      graphArray = [];
      clearInterval(interval)
      getData("https://api.coingecko.com/api/v3/coins/list")
        .then(arr => {
          // $('#spinner').css('display', 'block');
          displayDivs(arr.slice(500,599))
          // $('#spinner').removeClass('d-flex');
           $('#spinner').css('display','none')
        }).catch(err => alert(err.status + ": " + err.statusText));
      $('main').empty();


    })

    //add toggle functions
    $('main').on('click', 'input.toggle', function () {

      tempNameArr = [this.id];
      tempSymbolArr = [this.classList[1]];
      const chosenCurrency = this.id;
      const chosenSymbol = this.classList[1]

      //open modal and apped the content
      if (selectedCurrenciesName.length == 5 && !checkIfInArray(this.id, selectedCurrenciesName)) {
        $('.modal-body').empty();
        let newDiv = `<div><h4>Choose up to 5 currencies</h4>`
        for (let i = 0; i < selectedCurrenciesName.length; i++) {
          newDiv += `<div>
          <p class="${selectedCurrenciesName[i].toLowerCase().replace(/ /g, "-")}
           ${selectedCurrenciesSymbol[i]}">${selectedCurrenciesName[i]}</p>
             <label class="switch">
          <input  class="${selectedCurrenciesName[i].toLowerCase().replace(/ /g, "-")}
           modelCurrencies ${selectedCurrenciesSymbol[i]} " type="checkbox">
          <span class="slider round"></span>
        </label>
          </div>`
        }
        newDiv += `<div>
          <p class="${chosenCurrency} ${chosenSymbol}">${chosenCurrency}</p>
             <label class="switch">
          <input  class="${chosenCurrency.toLowerCase().replace(/ /g, "-")}
           modelCurrencies ${chosenSymbol} " type="checkbox" checked>
          <span class="slider round"></span>
        </label>
          </div>`
        newDiv += `</div>`;
        $('.modal-body').append(newDiv)
        $('input.toggle').attr('data-toggle', 'modal');
        $('input.toggle').attr('data-target', '#exampleModal');
      } else if (selectedCurrenciesName.length == 5 && checkIfInArray(this.id, selectedCurrenciesName)) {

        $('input.toggle').removeAttr("data-toggle")
        $('input.toggle').removeAttr("data-target")
      }

      // make array of choosen currencies from modal
      $('input.modelCurrencies').on('click', function () {

        const classList = $(this.classList)
        if (!checkIfInArray(classList[0], tempNameArr)) {
          tempNameArr.push(classList[0])
          tempSymbolArr.push(classList[2])
        } else {
          let index = tempNameArr.indexOf(classList[0]);
          tempNameArr.splice(index, index + 1)
          tempSymbolArr.splice(index, index + 1)
        }
      })


      // push or delete the value to the selectedCurrenciesName,selectedCurrenciesSymbol arrays
      if (!checkIfInArray(this.id, selectedCurrenciesName)) {
        if (selectedCurrenciesName.length < 5) {
          selectedCurrenciesName.push(this.id)
          localStorage.setItem("selectedCurrenciesName", JSON.stringify(selectedCurrenciesName));
          selectedCurrenciesSymbol.push(this.classList[1])
          localStorage.setItem("selectedCurrenciesSymbol", JSON.stringify(selectedCurrenciesSymbol));
        } else {
          $(this).prop('checked', false)
        }
      } else {
        selectedCurrenciesName.splice($.inArray(this.id, selectedCurrenciesName), 1);
        localStorage.setItem("selectedCurrenciesName", JSON.stringify(selectedCurrenciesName));
        selectedCurrenciesSymbol.splice($.inArray(this.classList[1], selectedCurrenciesSymbol), 1);
        localStorage.setItem("selectedCurrenciesSymbol", JSON.stringify(selectedCurrenciesSymbol));
      }
    });

    // save the tempArray from modal to selectedCurrenciesName if save clicked 
    $('#save').click(function () {
      if (tempNameArr.length <= 5) {
        selectedCurrenciesName = [...tempNameArr];
        localStorage.setItem("selectedCurrenciesName", JSON.stringify(selectedCurrenciesName));
        selectedCurrenciesSymbol = [...tempSymbolArr];
        localStorage.setItem("selectedCurrenciesSymbol", JSON.stringify(selectedCurrenciesSymbol));
        $('main').empty();
        getData("https://api.coingecko.com/api/v3/coins/list")
          .then(arr => displayDivs(arr.slice(500,599)))
          .catch(err => alert(err.status + ": " + err.statusText));
      } else {
        alert("you choose too many coins")
      }
    })

    //check if currency is in the array return true/false
    function checkIfInArray(id, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === id) {
          return true
        }
      }
      return false
    }

        //check if value undefind 
        function isValueUndefind(value) {
          if (value) {
            return value
          } else {
            return 'the api does not contain the convertion rate for '
          }
        }

    $('#about').click(function () {
      $('#searchCurrency').val('');
      $('.mainArea').empty();
      let about =`<div  class="about card" style="width: 18rem;">
      <img src="./assets/images/about.jpg" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">Alex Shvetsov</h5>
        <p class="card-text">Email: alexsh1412@gmail.com
        </p>
    
      </div>
    </div>`
    $('.mainArea').append(about);
    })


    // live report 
    $('#live').click(function () {
      $('#spinner').css('display', 'block');
      $('#searchCurrency').val('')
      $('main').empty();
      const newCanvas = `<div id="chartContainer" style="height: 500px; width: 100%;"></div>`
      $('main').append(newCanvas);

      let graphArray = [];
      let urlValues = ''
      for (let i = 0; i < selectedCurrenciesSymbol.length; i++) {
        if (i == (selectedCurrenciesSymbol.length - 1)) {
          urlValues += `${selectedCurrenciesSymbol[i].toUpperCase()}`
        } else {
          urlValues += `${selectedCurrenciesSymbol[i].toUpperCase()},`
        }
      }

      $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + urlValues + "&tsyms=USD", json => {
        if (json.Response && json.Data.length == 0) {
          alert("nothin here")
        } else if (json.Response && json.Data) {
          var graphArray = Object.keys(json.Data).map(function (data) {
            return [data, json.Data[data]];
          });
        } else {
          var graphArray = Object.keys(json).map(function (data) {
            return [data, json[data]];
          });
        }
     if(graphArray==0){
      $('main').empty();
      $('.mainArea').append(`<div>There is no information for any of those currencies</div>`)
     }
        var dataPoints1 = [];
        var dataPoints2 = [];
        var dataPoints3 = [];
        var dataPoints4 = [];
        var dataPoints5 = [];

        var options = {
        
          axisX: {
            title: "chart updates every 2 secs"
          },
          axisY: {
            suffix: "$",
            includeZero: false
          },
          toolTip: {
            shared: true
          },
          legend: {
            cursor: "pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick: toggleDataSeries
          },
          data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.0000$",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "Currency 1",
            dataPoints: dataPoints1
          },
          {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.0000$",
            showInLegend: true,
            name: "Currency 2",
            dataPoints: dataPoints2
          }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.0000$",
            showInLegend: true,
            name: "Currency 3",
            dataPoints: dataPoints3
          }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.0000$",
            showInLegend: true,
            name: "Currency 4",
            dataPoints: dataPoints4
          }, {
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "###.0000$",
            showInLegend: true,
            name: "Currency 5",
            dataPoints: dataPoints5
          }]
        };

        var chart = $("#chartContainer").CanvasJSChart(options);

        function toggleDataSeries(e) {
          if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          }
          else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }

        var updateInterval = 2000;
        // initial value
        var yValue1 = '';
        var yValue2 = '';
        var yValue3 = '';
        var yValue4 = '';
        var yValue5 = '';

        graphArray[0] ? yValue1 = +graphArray[0][1].USD : yValue1 = undefined;
        graphArray[1] ? yValue2 = +graphArray[1][1].USD : yValue2 = undefined;
        graphArray[2] ? yValue3 = +graphArray[2][1].USD : yValue3 = undefined;
        graphArray[3] ? yValue4 = +graphArray[3][1].USD : yValue4 = undefined;
        graphArray[4] ? yValue5 = +graphArray[4][1].USD : yValue5 = undefined;

        var time = new Date;
      
        time.getHours();
        time.getMinutes();
        time.getSeconds();
        time.getMilliseconds();
        $('#spinner').css('display', 'none');
        function updateChart(count) {
          $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + urlValues + "&tsyms=USD", json => {
            if (json.Response && json.Data.length == 0) {
              alert("nothin here")
            } else if (json.Response && json.Data) {
              var graphArray = Object.keys(json.Data).map(function (data) {
                return [data, json.Data[data]];
              });
            } else {
              var graphArray = Object.keys(json).map(function (data) {
                return [data, json[data]];
              });
            }

            count = count || 1;
            var deltaY1, deltaY2, deltaY3, deltaY4, deltaY5;
            for (var i = 0; i < count; i++) {
              time.setTime(time.getTime() + updateInterval);
              graphArray[0] ? deltaY1 = +graphArray[0][1].USD : deltaY1 = undefined;
              graphArray[1] ? deltaY2 = +graphArray[1][1].USD : deltaY2 = undefined;
              graphArray[2] ? deltaY3 = +graphArray[2][1].USD : deltaY3 = undefined;
              graphArray[3] ? deltaY4 = +graphArray[3][1].USD : deltaY4 = undefined;
              graphArray[4] ? deltaY5 = +graphArray[4][1].USD : deltaY5 = undefined;

              // adding random value and rounding it to two digits. 
              graphArray[0] ? yValue1 = +graphArray[0][1].USD : yValue1 = undefined;
              graphArray[1] ? yValue2 = +graphArray[1][1].USD : yValue2 = undefined;
              graphArray[2] ? yValue3 = +graphArray[2][1].USD : yValue3 = undefined;
              graphArray[3] ? yValue4 = +graphArray[3][1].USD : yValue4 = undefined;
              graphArray[4] ? yValue5 = +graphArray[4][1].USD : yValue5 = undefined;

              // pushing the new values
              dataPoints1.push({
                x: time.getTime(),
                y: yValue1
              });
              dataPoints2.push({
                x: time.getTime(),
                y: yValue2
              });
              dataPoints3.push({
                x: time.getTime(),
                y: yValue3
              });
              dataPoints4.push({
                x: time.getTime(),
                y: yValue4
              });
              dataPoints5.push({
                x: time.getTime(),
                y: yValue5
              });
            }
            // updating legend text with  updated with y Value 
            graphArray[0] ? options.data[0].legendText = graphArray[0][0] + " : " + yValue1 + "$" : options.data[0].legendText = ' ';
            graphArray[1] ? options.data[1].legendText = graphArray[1][0] + " : " + yValue2 + "$" : options.data[1].legendText = ' ';
            graphArray[2] ? options.data[2].legendText = graphArray[2][0] + " : " + yValue3 + "$" : options.data[2].legendText = ' ';
            graphArray[3] ? options.data[3].legendText = graphArray[3][0] + " : " + yValue4 + "$" : options.data[3].legendText = ' ';
            graphArray[4] ? options.data[4].legendText = graphArray[4][0] + " : " + yValue5 + "$" : options.data[4].legendText = ' ';

            $("#chartContainer").CanvasJSChart().render();
          });
        }
        updateChart(1);
        interval = setInterval(function () { updateChart() }, updateInterval);
      })
    })
  });
})();


