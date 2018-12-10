'use strict';

angular.module('myApp.container')
    .factory('ContainerServices', ['$http', '$q', '$timeout', 'SettingServices',
        function ($http, $q, $timeout, SettingServices) {
            var obj = {};

            obj.isOperationFinished = function (operationUrl) {
                return $http.get(SettingServices.getLxdUrl() + operationUrl);
            };


            // Get a container
            obj.getByName = function (containerName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName).then(function(response) {
                  return response;
                });
            };


            // Get all containers,  including detailed data
            obj.getAll = function () {
                // Sync
                return $http.get(SettingServices.getLxdApiUrl() + '/containers').then(function (data) {
                    data = data.data;

                    if (data.status != "Success") {
                        return $q.reject("Error");
                    }

                    var promises = data.metadata.map(function (containerUrl) {
                        return $http.get(SettingServices.getLxdUrl() + containerUrl).then(function (resp) {
                            return resp.data.metadata;
                        });
                    });

                    return $q.all(promises);
                });
            };


            // Get all containers,  including detailed data
            obj.getAllSimple = function () {
                // Sync
                return $http.get(SettingServices.getLxdApiUrl() + '/containers');
            };


            // Create container:
            obj.create = function (containerName, imageFingerprint, profiles, ephemeralState) {
                var containerData = {
                  name: containerName,
                  profiles: profiles,
                  ephemeral: ephemeralState,
                  source: {
                      type: "image",
                      fingerprint: imageFingerprint,
                  }
                };
                // Async
                return $http.post(SettingServices.getLxdApiUrl() + '/containers', containerData)
            };


            obj.createFromAlias = function (containerData, imageData) {
                containerData.source = {
                    type: "image",
                    alias: "ubuntu/16.04"
                };
                return $http.post(SettingServices.getLxdApiUrl() + '/containers', containerData);
            };


            // Modify container:
            obj.modify = function (containerName, containerData) {
                delete containerData['name'];
                delete containerData['status'];

                return $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName, containerData).then(function (data) {
                    return(data);
                });
            };


            // Rename  a container
            // Mode: Async
            obj.rename = function (containerName, containerData) {
                return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName, containerData);
            };


            // Delete a container
            // Mode: Async
            obj.delete = function (containerName) {
                return $http.delete(SettingServices.getLxdApiUrl() + '/containers/' + containerName).then(function (data) {
                    return data;
                });
            };


            /** State **/
            obj.getState = function (containerName) {
                return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/state');
            };


            obj.changeState = function (containerName, state) {
                var data =
                {
                    "action": state,        // State change action (stop, start, restart, freeze or unfreeze)
                    "timeout": 30,          // A timeout after which the state change is considered as failed
                    "force": true,          // Force the state change (currently only valid for stop and restart where it means killing the container)
                    "stateful": false        // Whether to store or restore runtime state before stopping or startiong (only valid for stop and start, defaults to false)
                };

                return $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/state', data);
            };


            /** Snapshot **/

            obj.getSnapshots = function(containerName) {
              return $http.get(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/snapshots').then(function (data) {
                  data = data.data;

                  if (data.status != "Success") {
                      return $q.reject("Error");
                  }


                  var promises = data.metadata.map(function (containerUrl) {
                      return $http.get(SettingServices.getLxdUrl() + containerUrl).then(function (resp) {
                          return resp.data.metadata;
                      });
                  });

                  return $q.all(promises);
              });

            };


            obj.createSnapshot = function(containerName, snapshotData) {
              return $http.post(SettingServices.getLxdApiUrl() + '/containers/' + containerName + '/snapshots', snapshotData);
            };


            obj.restoreSnapshot = function(containerName, snapshotName) {
              var data = {
                restore: snapshotName,
              };
              return $http.put(SettingServices.getLxdApiUrl() + '/containers/' + containerName, data);
            };

            return obj;
        }])
;
