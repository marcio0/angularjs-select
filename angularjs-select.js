angular.module('sp', []).directive('selectpicker', function ($parse, $filter) {
    var buttonTpl = '' +
        '<button type="button" class="btn btn-default dropdown-toggle" style="width: 100%" data-toggle="dropdown">' +
        '{{getLabel(value) || emptyText}}' + ' <span class="caret"></span>' +
        '</button>';
    var listTpl = '' +
        '<ul class="dropdown-menu" style="width: 100%" role="menu">' +
        '<li ng-repeat="option in options"><a href="#" ng-bind="getLabel(option)" ng-click="select(option)"></a></li>' +
        '</ul>';
    var groupedListTpl = '' +
        '<div class="dropdown-menu select-picker">' +
        '<div class="select-menu">' +
        '<ul class="" role="menu">' +
        '<li class="select-group" ng-repeat="group in groups" ng-click="liClick()">' +
        '<div class="select-group-ct" ng-bind="group.name"></div>' +
        '<ul>' +
        '<li ng-repeat="opt in group.items | filter:search" ng-click="select(opt)" class="select-item">' +
        '<div class="select-item-ct" ng-bind="getLabel(opt)"></div>' +
        '</li>' +
        '</ul>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '</div>';

    var searchBoxTpl = '' +
        '<div class="search-wrapper">' +
        '<input class="form-control item-search" ng-model="search.name"></input>'
        '</div>' +
        '';

    return {
        template: '<div class="btn-group" style="width: 100%"></div>',
        replace: true,
        scope: {
            value: '=ngModel',
            options: '=selectpickerOptions',
            label: '@selectpickerLabel',
            emptyText: '@selectpickerEmptyText',
            grouper: '@selectpickerGrouper'
        },
        compile: function compileFn(iElement, iAttrs, transclude) {
            var selectEl = [angular.element(buttonTpl), angular.element(groupedListTpl)];
            //var searchEl = angular.element(searchBoxTpl);
            //selectEl[1].prepend(searchEl)

            iElement.removeClass('form-control');
            //TODO remover ng-options se existir
            iElement.append(selectEl);
            
            selectEl[1].on('click', function (e) {
                if (e.target.classList.contains('select-item-ct') ||
                    e.target.classList.contains('select-item')) {
                    return true;
                }
                return false;
            });
            
            return {
                pre: function preLink(scope, element, attrs) {
                },
                post: function postLink(scope, element, attrs) {
                    scope.getLabel = function (option) {
                        return $parse(scope.label)(option);
                    };

                    scope.select = function select(option) {
                        scope.value = option;
                    };

                    function setupGroups (options) {
                        var groups = {}, groupsArray = [],
                            getter = $parse(scope.grouper);
                        
                        for (var i in options) {
                            var opt = options[i];
                            var groupName = getter(opt);
                            
                            if (groupName in groups) {
                                groups[groupName].push(opt);
                            }
                            else {
                                groups[groupName] = [opt];
                            }
                        }
                        
                        for (var i in groups) {
                            groupsArray.push({
                                name: i,
                                items: groups[i]
                            });
                        }
                        scope.groups = groupsArray;
                        return groupsArray;
                    };
                    
                    setupGroups();
                    scope.$watch('options', setupGroups);
                }
            };
        }
    };
});
