'use strict';

angular.module('myApp.remoteimage', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/remoteimages', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimages/remoteimages.html',
            controller: 'remoteimageListCtrl',
            resolve: {
                remoteimages: function (RemoteimageServices, $route) {
                    return RemoteimageServices.getAll();
                }
            }
        })
        .when('/remoteimage-view/:imageID', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/image-view.html',
            controller: 'remoteimageViewCtrl',
            resolve: {
                image: function (RemoteimageServices, $route) {
                    return RemoteimageServices.getByFingerprint($route.current.params.imageID)
                }
            }
        })
        .when('/remoteimage-add-remote', {
            title: 'Remoteimages',
            templateUrl: 'modules/remoteimage/image-add-remote.html',
            controller: 'remoteimageAddRemoteCtrl',
            resolve: {}
        })
        ;
    }])


    .controller('remoteimageViewCtrl', function ($scope, $routeParams, $filter, $location, image, RemoteimageServices) {
        $scope.image = image.data.metadata;
    })

    .controller('remoteimageListCtrl', function ($scope, $routeParams, $filter, $location,
                                           RemoteimageServices, remoteimages) {
        $scope.remoteimages = remoteimages;
    })

    .controller('remoteimageAddRemoteCtrl', function ($scope, $routeParams, $filter, $location, RemoteimageServices) {
        $scope.addRemoteImage = function () {
            RemoteimageServices.addRemoteImage($scope.url);
        }

        $scope.addSourceImage = function () {
            RemoteimageServices.addSourceImage();
        }
    })
;