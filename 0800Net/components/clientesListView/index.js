'use strict';

app.clientesListView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_clientesListView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_clientesListView
(function(parent) {
    var dataProvider = app.data.zeroOitocentos,
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('clientesListView'),
                dataSource = model.get('dataSource');

            if (paramFilter) {
                model.set('paramFilter', paramFilter);
            } else {
                model.set('paramFilter', undefined);
            }

            if (paramFilter && searchFilter) {
                dataSource.filter({
                    logic: 'and',
                    filters: [paramFilter, searchFilter]
                });
            } else if (paramFilter || searchFilter) {
                dataSource.filter(paramFilter || searchFilter);
            } else {
                dataSource.filter({});
            }
        },        
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Solicitacao',
                dataProvider: dataProvider
            },
            group: {
                field: 'NomeCliente'
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'Id': {
                            field: 'Id',
                            defaultValue: ''
                        },
                        'SolTitulo': {
                            field: 'SolTitulo',
                            defaultValue: ''
                        },
                        'DataAberturaSistema': {
                            field: 'DataAberturaSistema',
                            defaultValue: ''
                        },
                    }
                },
                parse : function(data) { //reduce text of message if being used for list
                    $.each(data, function(i, val){                        
                        if (val !== undefined && i == 'result') {
                            for (var j = 0; j < val.length; j++) {
                                val[j].DataAberturaSistema = kendo.toString(val[j].DataAberturaSistema, "d/M/yyyy hh:mm tt");
                            }                                                    
                        }
                    });
                    return data;
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        clientesListView = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {

                app.mobileApp.navigate('#components/detailsListView/details.html?filter={ "field" : "SolID", "operator" : "eq", "value" : "' + e.dataItem.Id + '"}');

            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('clientesListView', clientesListView);
        });
    } else {
        parent.set('clientesListView', clientesListView);
    }
    
    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;

        fetchFilteredData(param);
    });    
})(app.clientesListView);

// START_CUSTOM_CODE_clientesListViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_clientesListViewModel