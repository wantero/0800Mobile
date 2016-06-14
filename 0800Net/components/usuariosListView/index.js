'use strict';

app.usuariosListView = kendo.observable({
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
                dataProvider: dataProvider,
                read: {
                        headers: {
                            "X-Everlive-Expand": JSON.stringify({
                                   "UsuIDResponsavel": {
            					       "TargetTypeName": "Usuario",
                                       "ReturnAs": "UsuNome",
                        			   "SingleField": "UsuNome"
        							}
                            })
                    }
                }                
            },
            group: {
                field: 'UsuNome'
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
                        'UsuNome': {
                            field: 'UsuNome', // show the user's DisplayName instead of the UserId
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
        usuariosListViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {

                app.mobileApp.navigate('#components/detailsListView/details.html?filter={ "field" : "SolID", "operator" : "eq", "value" : "' + e.dataItem.Id + '"}');

            },
            currentItem: null
        });

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('usuariosListViewModel', usuariosListViewModel);
        });
    } else {
        parent.set('usuariosListViewModel', usuariosListViewModel);
    }
})(app.usuariosListView);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel