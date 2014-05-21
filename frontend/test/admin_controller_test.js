//================================================================================
// Application Code

window.App = Ember.Application.create();

// Our normal data store, which we be overridden when testing.
App.Store = DS.Store.extend({
    revision: 12,
    adapter: DS.RESTAdapter.create()
});

App.Employee = DS.Model.extend({
    name: DS.attr("string"),
    salary: DS.attr("number"),
    managedBy: DS.belongsTo("App.Employee"),
    manages: DS.hasMany("App.Employee")
});

App.Router.map(function () {
    this.route("index", { path: "/" });
    this.route("employees", { path: "/employees" });
    this.route("employee", { path: "/employee/:employee_id" });
});

App.EmployeesRoute = Ember.Route.extend({
    model: function (params) {
        return App.Employee.find();  
    }
});

App.EmployeeRoute = Ember.Route.extend({
    model: function (params) {
        return App.Employee.find(params.employee_id);  
    }
});

App.EmployeeController = Ember.ObjectController.extend({
    giveRaise: function () {
        this.set("salary", this.get("salary") * 1.10);
    }
});

// Declare this explicitly so we can test it.
App.EmployeeView = Ember.View.extend({
    // Only needed so we can be called outside of a route by our unit tests.
    templateName: 'employee'   
});

//================================================================================
// Test Code

// Replace our fixture-based store with a REST-based store for testing, so we
// don't need a server.  We disable simulateRemoteResponse so that objects will
// appear to load at the end of every Ember.run block instead of waiting for a
// timer to fire.
App.Store = DS.Store.extend({
    revision: 12,
    adapter: DS.FixtureAdapter.create({ simulateRemoteResponse: false })
});

// Declare some fixture objects to use in our test application.  There's
// nothing like factory_girl or machinist yet.
App.Employee.FIXTURES = [{
    id: 1,
    name: "Jane Q. Public",
    salary: 80000,
    managedBy: null,
    manages: [2]
}, {
    id: 2,
    name: "John Q. Public",
    salary: 60000,
    managedBy: 1,
    manages: []
}];

// Run before each test case.
QUnit.testStart(function () {
    // Put the application into a known state, and destroy the defaultStore.
    // Be careful about DS.Model instances stored in App; they'll be invalid
    // after this.
    // This is broken in some versions of Ember and Ember Data, see:
    // https://github.com/emberjs/data/issues/847
    Ember.run(function () { App.reset(); });
    // Display an error if asynchronous operations are queued outside of
    // Ember.run.  You need this if you want to stay sane.
    Ember.testing = true;
});

// Run after each test case.
QUnit.testDone(function () {
    Ember.testing = false;
});

// Optional: Clean up after our last test so you can try out the app
// in the jsFiddle.  This isn't normally required.
QUnit.done(function () {
    Ember.run(function () { App.reset(); });
});

// Load associations immediately, instead of waiting for FixtureAdapter's
// asynchronous loads.  Basically, all we need to do is access each object
// from inside Ember.run.
// TODO: We can't test this or insert where needed until App.reset() works.
// TODO: Handle hasMany.
function loadAssociations(object /*, paths... */) {
    var paths = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < paths.length; i++) {
        var components = paths[i].split(".");
        for (var j = 0; j < components.length; j++) {
            Ember.run(function () {
                var path = components.slice(0, j+1).join(".");
                object.get(path);
            });
        }
    }
}

// Sample model test.

module("App.Employee");

test("has a name", function () {
    var jane;
    Ember.run(function () {
        // Won't actually load until the end of the run-block.
        jane = App.Employee.find(1);
    });
    equal(jane.get("name"), "Jane Q. Public");
});

// Sample controller test.

module("App.EmployeeController", {
    setup: function () {
        Ember.run(this, function () {
            // We could also fetch a model from our fixtures.
            this.model = App.Employee.createRecord({ salary: 100000 });
            this.controller = App.EmployeeController.create({ content: this.model });
        });
    }
});
    
test("can give the employee a raise", function () {
    var oldSalary = this.model.get("salary");
    Ember.run(this, function () {
        this.controller.giveRaise();
    });
    equal(this.model.get("salary"), oldSalary * 1.1);
});

