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
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('clientesListViewModel'),
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
            dataSource: dataSource,
            itemClick: function(e) {

                app.mobileApp.navigate('#components/clientesListView/details.html?uid=' + e.dataItem.uid);

            },
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = clientesListViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);

                if (!itemModel.DataAprovacao) {
                    itemModel.DataAprovacao = String.fromCharCode(160);
                }

                clientesListViewModel.set('currentItem', null);
                clientesListViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('clientesListViewModel', clientesListViewModel);
        });
    } else {
        parent.set('clientesListViewModel', clientesListViewModel);
    }
    
    parent.set('onShow', function(e) {
        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;

        fetchFilteredData(param);
    });    
})(app.clientesListView);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel