var queryFields = []

var geo_subscription_information = {
    'filters': {
        'attribute_filters': [],
        'geometric_filters': []
    }, 'builders': []
};

var map = L.map('map').setView([37.8, -96], 3);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

function inputConnectorSelect() {
    var selectedValue = $('select#inputConnector option:selected').val();
    geo_subscription_information.input_connector = selectedValue;
    if (selectedValue != 'mapLayer') {
        document.getElementById('inputConnectorSection').style.display = 'none';
        document.getElementById('urlSection').style.display = 'block';
    }
}

function inputUrlSelect() {
    var inputUrl = document.getElementById('inputUrl').value;
    var selectedValue = $('select#inputConnector option:selected').val();
    geo_subscription_information.input_url = inputUrl;

    if (selectedValue == 'arcgis') {
        geo_subscription_information.input_connector = 'arcgis';
        geo_subscription_information.input_url = inputUrl;
        $.ajax({
            url: inputUrl + '?f=pjson',
            dataType: 'JSON'
        }).done(function (results) {
            results.fields.forEach(element => {
                queryFields.push(element.name)
                $('#inputFilterColumn')
                    .append($("<option></option>")
                        .attr("value", element.name)
                        .text(element.name));
            });
            document.getElementById('urlSection').style.display = 'none';
            document.getElementById('nameSection').style.display = 'block';
        });
    }
}

function inputFilterField() {
    document.getElementById('inputFilterSelection').style.display = 'none';
    document.getElementById('mapFilterField').style.display = 'none';
    document.getElementById('inputFilterField').style.display = 'block';
    if (geo_subscription_information.filters.attribute_filters.length > 0) {
        document.getElementById('inputFilterValueAndOr').style.display = 'block';
    }
}

function inputFilterValueChange() {
    var inputUrl = document.getElementById('inputUrl').value;
    var inputValue = document.getElementById('inputFilterValue').value;
    var inputColumn = $('select#inputFilterColumn option:selected').val();
    $.ajax({
        url: inputUrl + '/query?where=' + inputColumn + '+LIKE+%27' + inputValue + '%25%27&outFields=' + inputColumn + '&returnGeometry=false&resultRecordCount=10&f=json',
        dataType: 'JSON'
    }).done(function (results) {
    });
}

function inputFilterValueComplete() {
    var inputValue = document.getElementById('inputFilterValue').value;
    var inputColumn = $('select#inputFilterColumn option:selected').val();
    var inputComparison = $('select#inputFilterComparison option:selected').val();
    $('#inputFilterModal').modal('hide');
    geo_subscription_information.filters.attribute_filters.push({
        [inputColumn]: inputValue,
        'where_clause': inputComparison
    })
    $('#inputFilterList').append('<li class="list-group-item">' + inputColumn + ' ' + inputComparison + ' ' + inputValue + '</li>')

}

function addInputFilter() {
    document.getElementById('inputFilterSelection').style.display = 'block';
    document.getElementById('inputFilterField').style.display = 'none';
    $('#inputFilterModal').modal('show');
    map._onResize(); 
}

function inputFilterGeographic(){
    document.getElementById('inputFilterSelection').style.display = 'none';
    document.getElementById('inputFilterField').style.display = 'none';
    document.getElementById('mapFilterField').style.display = 'block';
    map._onResize();
}

function newGeoSubscription() {
    document.getElementById('geoSubscriptionSection').style.display = 'block';
    document.getElementById('geoSubscriptions').style.display = 'none';
}

function dataType() {
    var geoSubscriptionName = document.getElementById('geoSubscriptionName').value;
    geo_subscription_information.subscription_name = geoSubscriptionName;
    document.getElementById('inputConnectorSection').style.display = 'block';
    document.getElementById('geoSubscriptionSection').style.display = 'none';
}

function filterSelect() {
    document.getElementById('inputAnalysis').style.display = 'block';
    document.getElementById('inputFilters').style.display = 'none';
}

function inputNameSelect() {
    var geoSubscriptionTableName = document.getElementById('geoSubscriptionTableName').value;
    geo_subscription_information.table_id = geoSubscriptionTableName;
    document.getElementById('inputFilters').style.display = 'block';
    document.getElementById('nameSection').style.display = 'none';
}

function analysisSelect() {
    document.getElementById('geoSubscriptionTiming').style.display = 'block';
    document.getElementById('inputAnalysis').style.display = 'none';
}

function addInputAnalysis(){
    $('#inputAnalysisModal').modal('show');
}

function timingSelect() {
    console.log(JSON.stringify(geo_subscription_information))
}