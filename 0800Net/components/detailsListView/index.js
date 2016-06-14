'use strict';

app.detailsListView = kendo.observable({
    onShow: function() {},
    afterShow: function () { }
});

// START_CUSTOM_CODE_detailsListView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_detailsListView
(function(parent) {
    var dataProvider = app.data.zeroOitocentos,
        fetchFilteredData = function(paramFilter, searchFilter) {
            var model = parent.get('detailsListView'),
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
            type: "everlive",
            transport: {
                // binding to the Order type in Everlive
                typeName: "Tramite",
                dataProvider: dataProvider,
                read: {
                    headers: {
                        "X-Everlive-Expand": JSON.stringify({
                            "UsuID": {
                                "TargetTypeName": "Usuario",
                                "ReturnAs": "UsuNome",
                                "SingleField": "UsuNome"
                            }
                        })
                    }
                }
            },
            schema: {
                model: {
                    id: "Id",
                    fields: {
                        // default Everlive fields
                        CreatedBy:  { type: "string" },
                        CreatedAt:  { type: "date" },
                        ModifiedAt: { type: "date" },

                        // type fields
                        Id:    { type: "number" },
                        SolID: { type: "number" },
                        TraData:  { type: "String" },
                        Descricao:  { type: "String" },
                        UsuNome: { field: 'UsuNome', // show the user's DisplayName instead of the UserId
                                   defaultValue: ''},
                    }
                },
                parse : function(data) { //reduce text of message if being used for list
                    $.each(data, function (i, val) {
                        if (val !== undefined && i == 'result') {
                            for (var j = 0; j < val.length; j++) {
                                val[j].Descricao = atob(val[j].Descricao);
                                val[j].TraData = kendo.toString(val[j].TraData, "d/M/yyyy hh:mm tt");
                            }                                                    
                        }
                    });
                    return data;
                }                                        
            },
            serverFiltering: true,
            serverPaging: true,
            serverSorting: true,
            filter: { field : "SolID", operator : "eq", value : "0"},
            sort: { field: 'Id', dir: 'asc' }                                                      
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
		detailsListView = kendo.observable({
            dataSource: dataSource
        });        

    if (typeof dataProvider.sbProviderReady === 'function') {
        dataProvider.sbProviderReady(function dl_sbProviderReady() {
            parent.set('detailsListView', detailsListView);
        });
    } else {
        parent.set('detailsListView', detailsListView);
    }
    
    //dataSource.read().then(function() {

    //});
    
    parent.set('onShow', function (e) {

        var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;

        e.view.options.title = "Chamado: " + param.value;

        var listView = $("#listView").data("kendoMobileListView");
        if (listView !== undefined) {

            var newDataSource = new kendo.data.DataSource(/* your data source options */);
            listView.setDataSource(newDataSource);

        }
        
        fetchFilteredData(param);
        
    });

})(app.detailsListView);

// START_CUSTOM_CODE_detailsListViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_detailsListViewModel