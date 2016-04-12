'use strict';

app.clientesListView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function(parent) {
    var dataProvider = app.data.zeroOitocentos,
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
                        if (i == 'result') {
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
        clientesListViewModel = kendo.observable({
            dataSource: dataSource
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('clientesListViewModel', clientesListViewModel);
        });
    } else {
        parent.set('clientesListViewModel', clientesListViewModel);
    }
})(app.clientesListView);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel