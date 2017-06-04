'use strict';

function GlancesController($scope, $timeout, GlancesStats, REFRESH_TIME, Hotkeys) {
    var vm = this;

    vm.dataLoaded = false;

    var refreshDataSuccess = function (data) {
        data.isBsd = data.stats['system']['os_name'] === 'FreeBSD';
        data.isLinux = data.stats['system']['os_name'] === 'Linux';
        data.isMac = data.stats['system']['os_name'] === 'Darwin';
        data.isWindows = data.stats['system']['os_name'] === 'Windows';

        $scope.$broadcast('data_refreshed', data);
        vm.dataLoaded = true;

        nextLoad();
    };

    var refreshDataError = function() {
        $scope.$broadcast('is_disconnected');
        nextLoad();
    };

    vm.refreshData = function () {
        GlancesStats.getData().then(refreshDataSuccess, refreshDataError);
    };

    var loadPromise;
    var cancelNextLoad = function() {
      $timeout.cancel(loadPromise);
    };

    var nextLoad = function() {
      cancelNextLoad();
      loadPromise = $timeout(vm.refreshData, REFRESH_TIME * 1000); // in milliseconds
    };

    vm.refreshData();

    Hotkeys.registerHotkey(Hotkeys.createHotkey({
        key: 'm',
        callback: function () {
          console.log('Sort processes by MEM%');
        }
    }));
}
