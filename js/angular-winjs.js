(function (global) {
    "use strict;"

    var module = angular.module("winjs", []);

    function getTemplate(elementType, transclude) {
        var template = "";
        if (elementType) {
            if (transclude) {
                template = "<" + elementType + " ng-transclude='true'></" + elementType + ">";
            } else {
                template = "<" + elementType + "></" + elementType + ">";
            }
        }
        return template;
    }

    function getBindableApi(ctor) {
        var properties = [];
        var events = [];
        var prototype = ctor.prototype;
        do {
            for (var key in prototype) {
                var pd = Object.getOwnPropertyDescriptor(prototype, key);
                if (pd && pd.get && pd.set) {
                    if (key[0] === "o" && key[1] === "n") {
                        events.push(key);
                    } else if (key[0] !== "_") {
                        properties.push(key);
                    }
                }
            }
        } while (prototype = Object.getPrototypeOf(prototype));

        var api = {};
        properties.forEach(function (key) {
            api[key] = "=?";
        });
        events.forEach(function (key) {
            api[key] = "&";
        });
        return api;
    }

    function createOptions(processors, $scope, keys, getControl) {
        processors = processors || {};
        function update(key, $new, $old) {
            if ($new !== $old) {
                getControl()[key] = (processors[key] || angular.identity)($new, $old, getControl);
            }
        }
        return keys.reduce(function (options, key) {
            var value = $scope[key];
            if (value) {
                options[key] = (processors[key] || angular.identity)(value, null, getControl);
            }
            $scope.$watch(key, function ($new, $old) {
                update(key, $new, $old);
            });
            return options;
        }, {});
    }

    function controlDirectiveModel(ctor, createOptions, preLink, postLink, elementType, transclude) {
        var scopeSpec = getBindableApi(ctor);
        var scopeSpecKeys = Object.keys(scopeSpec);
        var template = getTemplate(elementType, transclude);
        return {
            restrict: "E", // @TODO, consider AE
            transclude: !!transclude,
            template: template,
            replace: !!elementType,
            scope: scopeSpec,
            link: function ($scope, elements, attrs) {
                var element = elements[0];
                var control;
                var options = createOptions($scope, scopeSpecKeys, function () { return control; });
                preLink.forEach(function (f) { f($scope, options); });
                control = new ctor(element, options);
                postLink.forEach(function (f) { f($scope, control); });
                $scope.$on("$destroy", function () {
                    if (control.dispose) {
                        control.dispose();
                    }
                });
                return control;
            },
        };
    }

    // spec is an object which has: 
    // {
    //   elementType?: string, /* default is DIV */
    //   transclude?: boolean, /* default is false */
    //   optionsProcessors?: { name: (value) => value }, /* record of funcs by name */
    //   model?: [(model) => model], /* default is [] */
    //   preLink?: [($scope, options) => void], /* default is [] */
    //   postLink?: [($scope, control) => void], /* default is [] */
    // }
    function directive(modelGenerator, name, spec) {
        var shortName = "win" + name.substr(name.lastIndexOf(".") + 1);
        module.directive(shortName, function () {
            var ctor = WinJS.Utilities.getMember(name, global);
            var model = modelGenerator(
                ctor,
                createOptions.bind(null, spec.optionsProcessors || {}),
                spec.preLink || [],
                spec.postLink || [],
                spec.elementType || "DIV",
                spec.transclude || false
            );
            (spec.model || []).forEach(function (transform) {
                model = transform(model);
            });
            return model;
        })
    }

    function eventAction(eventName, action) {
        return function ($scope, control) {
            control.addEventListener(eventName, function () {
                $scope.$apply(function () {
                    action($scope, control);
                });
            });
        };
    }

    function eventPropertySet(eventName, property) {
        return eventAction(eventName, function ($scope, control) {
            $scope[property] = control[property];
        });
    }

    function anchorUpdate($new, $old, getControl) {
        $new = typeof $new === "string" ? document.querySelector($new) : $new;
        $old = typeof $old === "string" ? document.querySelector($old) : $old;
        if ($old && $old._anchorClick) {
            $old.removeEventListener("click", $old._anchorClick);
            $old._anchorClick = null;
        }
        if ($new && !$new._anchorClick) {
            $new._anchorClick = function () { getControl().show(); };
            $new.addEventListener("click", $new._anchorClick);
        }
        return $new;
    }

    function anchorWireup($scope, control) {
        if (control.anchor && control.anchor instanceof HTMLElement && !control.anchor._anchorClick) {
            control.anchor._anchorClick = function () { control.show(); };
            control.anchor.addEventListener("click", control.anchor._anchorClick);
        }
    }

    function bindingList($new, $old, getControl) {
        if ($new && Array.isArray($new)) {
            $new = new WinJS.Binding.List($new, { proxy: true });
        }
        return $new;
    }

    function dataSource($new, $old, getControl) {
        $new = bindingList($new);
        if ($new && $new.dataSource) {
            $new = $new.dataSource;
        }
        return $new;
    }

    function controller(contentProperties) {
        return function (model) {
            contentProperties.forEach(function (property) {
                model.scope[property] = "=?";
            });
            model.controller = function ($scope) {
                var that = this;
                contentProperties.forEach(function (property) {
                    var _value;
                    Object.defineProperty(that, property, {
                        get: function () { return $scope[property]; },
                        set: function (value) { $scope[property] = value; }
                    });
                })
            };
            return model;
        };
    }

    var controls = {
        "WinJS.UI.AppBar": {
            transclude: true
        },
        "WinJS.UI.AppBarCommand": {
            elementType: "BUTTON",
            transclude: true,
        },
        "WinJS.UI.BackButton": {},
        "WinJS.UI.DatePicker": {
            postLink: [eventPropertySet("change", "current")],
        },
        "WinJS.UI.FlipView": {
            model: [controller(["itemTemplate"])],
            optionsProcessors: {
                itemDataSource: dataSource,
            },
            transclude: true,
        },
        "WinJS.UI.Flyout": {
            optionsProcessors: { anchor: anchorUpdate, },
            postLink: [anchorWireup],
            transclude: true,
        },
        "WinJS.UI.Hub": {
            model: [controller(["headerTemplate"])],
            postLink: [eventPropertySet("loadingstatechanged", "loadingState")],
            transclude: true,
        },
        "WinJS.UI.HubSection": {
            transclude: true
        },
        "WinJS.UI.ItemContainer": {
            postLink: [eventPropertySet("selectionchanged", "selection")],
            transclude: true,
        },
        "WinJS.UI.ListView": {
            // @TODO, can we get things like selection bound?
            model: [controller(["itemTemplate", "groupHeaderTemplate", "layout"])],
            optionsProcessors: {
                itemDataSource: dataSource,
                groupDataSource: dataSource,
            },
            transclude: true,
        },
        "WinJS.UI.Menu": {
            optionsProcessors: { anchor: anchorUpdate, },
            postLink: [anchorWireup],
            transclude: true,
        },
        "WinJS.UI.MenuCommand": {
            elementType: "BUTTON",
        },
        "WinJS.UI.NavBar": {
            transclude: true
        },
        "WinJS.UI.NavBarContainer": {
            model: [controller(["template"])],
            optionsProcessors: {
                data: bindingList,
            },
            transclude: true,
        },
        "WinJS.UI.NavBarCommand": {
            transclude: true
        },
        "WinJS.UI.Rating": {
            postLink: [eventPropertySet("change", "userRating")],
        },
        "WinJS.UI.SearchBox": {
            postLink: [eventPropertySet("querychanged", "queryText")],
        },
        "WinJS.UI.SemanticZoom": {
            transclude: true,
        },
        "WinJS.UI.TimePicker": {
            postLink: [eventPropertySet("change", "current")],
        },
        "WinJS.UI.ToggleSwitch": {
            postLink: [eventPropertySet("change", "checked")],
        },
        "WinJS.UI.Tooltip": {
            model: [controller(["contentElement"])],
            transclude: true,
        },
    };
    Object.keys(controls).forEach(function (key) {
        directive(controlDirectiveModel, key, controls[key]);
    });

    // Tooltop is a little odd because you have to be able to specify both the element
    // which has a tooltip (the content) and the tooltip's content itself. We specify
    // a special directive <win-tooltip-content /> which represents the latter.
    function tooltipContentModel() {
        return {
            require: "^winTooltip",
            restrict: "E",
            transclude: true,
            link: function ($scope, elements, attrs, tooltip) {
                tooltip.contentElement = elements[0].firstElementChild;
            },
            template: "\
<div style='display:none'>\
  <div ng-transclude='true'></div>\
</div>",
            replace: true,
        };
    }
    module.directive("winTooltipContent", tooltipContentModel);

    // Templates are needed for the ListView and FlipView, this makes directives which
    // can be specified within a ListView or FlipView as item or group header templates
    // which themselves simply contain angular bindings.
    function templateDirective(name, parents) {
        module.directive("win" + name[0].toUpperCase() + name.substr(1), function () {
            return {
                require: parents.map(function (item) { return "^?" + item; }),
                restrict: "E",
                compile: function (tElement, tAttrs, transclude) {
                    var rootElement = document.createElement("div");
                    Object.keys(tAttrs).forEach(function (key) {
                        if (key[0] !== '$') {
                            rootElement.setAttribute(key, tAttrs[key]);
                        }
                    });
                    var immediateToken;
                    return function ($scope, elements, attrs, parents) {
                        var parent = parents.reduce(function (found, item) { return found || item; });
                        parent[name] = function (itemPromise) {
                            return itemPromise.then(function (item) {
                                var itemScope = $scope.$new();
                                itemScope.item = item;
                                var result = rootElement.cloneNode(false);
                                transclude(itemScope, function (clonedElement) {
                                    for (var i = 0, len = clonedElement.length; i < len; i++) {
                                        result.appendChild(clonedElement[i]);
                                    }
                                });
                                WinJS.Utilities.markDisposable(result, function () {
                                    itemScope.$destroy();
                                });
                                immediateToken = immediateToken || setImmediate(function () {
                                    immediateToken = null;
                                    itemScope.$apply();
                                });
                                return result;
                            })
                        };
                    };
                },
                replace: true,
                transclude: true,
            };
        });
    }
    templateDirective("itemTemplate", ["winListView", "winFlipView"]);
    templateDirective("groupHeaderTemplate", ["winListView"]);
    // @TODO, make these work
    //templateDirective("headerTemplate", ["winHub"]);
    //templateDirective("template", ["winNavBarContainer"]);

    function layoutDirectiveModel(ctor, createOptions, preLink, postLink) {
        var scopeSpec = getBindableApi(ctor);
        var scopeSpecKeys = Object.keys(scopeSpec);
        return {
            require: "^winListView",
            restrict: "E",
            transclude: false,
            replace: true,
            template: "",
            scope: scopeSpec,
            link: function ($scope, elements, attrs, listView) {
                var layout;
                var options = createOptions($scope, scopeSpecKeys, function () { return layout; });
                preLink.forEach(function (f) { f($scope, options); });
                layout = new ctor(options);
                postLink.forEach(function (f) { f($scope, layout); });
                listView.layout = layout;
                return layout;
            }
        }
    }

    var layouts = {
        "WinJS.UI.CellSpanningLayout": {},
        "WinJS.UI.GridLayout": {},
        "WinJS.UI.ListLayout": {}
    };
    Object.keys(layouts).forEach(function (key) {
        directive(layoutDirectiveModel, key, layouts[key]);
    });

    // This guy is a real odd-ball, you really need to coordinate with the settings 
    // event which fires, I need to think more about this.
    WinJS.UI.SettingsFlyout;

    // Do not support explicitly, use ng-repeat
    //WinJS.UI.Repeater;

}(this));
