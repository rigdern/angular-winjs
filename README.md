angular-winjs
=============

Project to smooth the AngularJS/WinJS interaction, this code is a shim layer which facilitates usage of WinJS UI controls in an Angular Windows application. It achieves this by creating directives for the various controls which allow them to show up in Angular markup like:

    <win-list-view item-data-source="ratings">
        <win-item-template>Hi: {{item.data.rating}}</win-item-template>
    </win-list-view>

How to use this in your Angular project?
----------------------------------------

Just make sure to include WinJS 2.0, and then include the shim.

    <link href="//Microsoft.WinJS.2.0/css/ui-dark.css" rel="stylesheet" />
    <script src="//Microsoft.WinJS.2.0/js/base.js"></script>
    <script src="//Microsoft.WinJS.2.0/js/ui.js"></script>
    <script src="/js/angular-winjs.js"></script>

__Note: this shim library only works against Angular 1.1+, I've been testing it using 1.2.6.__

Examples of control usage
-------------------------

### AppBar and AppBarCommand

    <!-- Shows up on the bottom of the screen, use right-click or touch edgy gesture to show -->
    <win-app-bar>
        <win-app-bar-command icon="'home'" label="'Home'"></win-app-bar-command>
        <win-app-bar-command icon="'save'" label="'Save'"></win-app-bar-command>
    </win-app-bar>

### BackButton

    <!-- Won't show up unless you use WinJS.Navigation stack -->
    <win-back-button></win-back-button>

### DatePicker

    <win-date-picker current="date"></win-date-picker>

### FlipView

    <win-flip-view item-data-source="ratings">
        <win-item-template>This flip view item's rating is: {{item.data.rating}}</win-item-template>
    </win-flip-view>

### Flyout

    <button id="flyoutAnchor">Show a flyout!</button>
    <win-flyout anchor="'#flyoutAnchor'">This is the flyout content!!</win-flyout>

### Hub and HubSection

    <win-hub>
        <win-hub-section header="'First section'" is-header-static="true">
          Hubs are useful for varied content
        </win-hub-section>
        <win-hub-section header="'The second section'">
          This hub is boring however, it just has things like data bindings: {{ratings.length}}
        </win-hub-section>
        <win-hub-section header="'The tail...'">
          Because it's only purpose is to show how to create a hub
        </win-hub-section>
    </win-hub>

### ItemContainer

    <win-item-container>
      An ItemContainer is a wrapper around content that adds pressed
      and cross-slide selection behaviors!
    </win-item-container>

### ListView

    <div>Selected count: {{selection.length}}, indexes: {{selection.toString()}}</div>
    <win-list-view item-data-source="ratings" selection="selection">
        <win-item-template>This list view item's rating is: {{item.data.rating}}</win-item-template>
        <win-list-layout></win-list-layout>
    </win-list-view>

### Menu and MenuCommand

    <button id="menuAnchor">Show a menu!</button>
    <win-menu anchor="'#menuAnchor'">
        <win-menu-command label="'command the first'"></win-menu-command>
        <win-menu-command label="'command the second'"></win-menu-command>
        <win-menu-command label="'this would be a great place for ng-repeater...'"></win-menu-command>
    </win-menu>

### NavBar and friends

    <!-- Shows up on the top of the screen, use right-click or touch edgy gesture to show -->
    <win-nav-bar>
        <win-nav-bar-container>
            <win-nav-bar-command label="'Home'" icon="'home'" tooltip="'Go home!!'"></win-nav-bar-command>
            <win-nav-bar-command label="'Save'" icon="'save'"></win-nav-bar-command>
        </win-nav-bar-container>
    </win-nav-bar>

### Pivot and PivotItem (only supported on WinJS 2.1 for Phone today)

    <win-pivot>
        <win-pivot-item header="'First'">
          Pivots are useful for varied content
        </win-pivot-item>
        <win-pivot-item header="'Second'">
          This Pivot  is boring however, it just has things like data bindings: {{ratings.length}}
        </win-pivot-item>
        <win-pivot-item header="'Tail...'">
          Because it's only purpose is to show how to create a Pivot
        </win-pivot-item>
    </win-pivot>

### Rating

    The current rating is: {{ratings[0].rating}}.<br/>
    <win-rating max-rating="5" user-rating="ratings[0].rating"></win-rating>

### SearchBox

    The current search text is: {{searchText}}.<br/>
    <win-search-box query-text="searchText"></win-search-box>

### SemanticZoom

    <win-semantic-zoom>
        <win-list-view item-data-source="data" group-data-source="data.groups">
            <win-item-template>
                The data is: {{item.data}}
            </win-item-template>
            <win-group-header-template>
                The group is: {{item.key}}
            </win-group-header-template>
        </win-list-view>
        <win-list-view item-data-source="data.groups">
            <win-item-template>
                The group is: {{item.key}}
            </win-item-template>
        </win-list-view>
    </win-semantic-zoom>

### TimePicker

    <win-time-picker current="time"></win-time-picker>

### ToggleSwitch
    
    <win-toggle-switch checked="toggleDisabled" label-on="'Other Switch Disabled'" label-off="'Other Switch Enabled'"></win-toggle-switch>
    The state is: {{toggleState}}<br/>
	<win-toggle-switch checked="toggleState" disabled="toggleDisabled"></win-toggle-switch>

### Tooltip

    <win-tooltip>
        <win-tooltip-content>This can have arbitrary content, like images...</win-tooltip-content>
        This has a tooltip, hover and see...
    </win-tooltip>

Notes
-----

For all of the controls you can bind to all public properties and events and the camel cased property names conveniently map to attributes.

There's some things left to be done like WinJS.UI.SettingsFlyout and rounding out the support for two-way binding of things like ListView selection state.
