'use strict';

(function() {
    var app = {
        data: {}
    };
    
    // This is your Telerik Backend Services App ID.
    var appId = '6imjrfulirub3yim';

    // This is the scheme (http or https) to use for accessing the Telerik Backend Services REST API.
    var bsScheme = 'http';    
    
    // This is your Google Cloud Console API project number. It is required by Google in order to enable push notifications for your Android. You do not need it for iOS.
    var googleApiProjectNumber = '677226977791';    

    var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                transition: 'slide',
                skin: 'nova',
                initial: 'components/clientesListView/view.html'
            });
        });
    };
    
    /*var _onDeviceIsRegistered = function() {
        
    };    
    
    var onAndroidPushReceived = function(args) {
        alert('Android notification received: ' + JSON.stringify(args)); 
    };

    var onIosPushReceived = function(args) {
        alert('iOS notification received: ' + JSON.stringify(args)); 
    };

    var onWP8PushReceived = function (args) {
        alert('Windows Phone notification received: ' + JSON.stringify(args)); 
    };    
    
    var registerForPush = function() {
        $(function() {
            var el = app.data.zeroOitocentos;
                                   
            var pushSettings = {
                android: {
                    senderID: googleApiProjectNumber
                },
                iOS: {
                    badge: "true",
                    sound: "true",
                    alert: "true"
                },
                wp8: {
                    channelName:'EverlivePushChannel'
                },
                notificationCallbackAndroid : onAndroidPushReceived,
                notificationCallbackIOS: onIosPushReceived,
                notificationCallbackWP8: onWP8PushReceived
            };
            
            el.push.register(pushSettings)
                .then(
                    _onDeviceIsRegistered,
                    function(err) {
                        alert('REGISTER ERROR: ' + JSON.stringify(err));
                    }
                    );
        });
    };*/    
    
    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }
            //registerForPush();
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li a.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp