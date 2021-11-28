import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Model } from 'miragejs';
import { modelFor } from 'ember-mirage/ember-data';
import { setupMirage } from 'ember-mirage/test-support';

const CustomTag = Model.extend();
CustomTag.__isCustom__ = true;

module('Acceptance | Ember Data', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    // this.server = new Server({
    //   environment: 'development',
    //   discoverEmberDataModels: true,
    //   scenarios: {
    //     default() {}
    //   },
    //   models: {
    //     // Friend exists in dummy/app/models. We want to make sure pre-defined
    //     // models take precedence
    //     tag: CustomTag,
    //     foo: Model.extend()
    //   },
    //   factories: {}
    // });
  });

  // hooks.afterEach(function() {
  //   this.server.shutdown();
  // });

  test(`Ember data models were generated and loaded`, function (assert) {
    let { schema } = this.server;
    let registry = schema._registry;

    assert.ok(registry.foo, 'Mirage model Foo has been registered');
    assert.ok(registry.book, 'EmberData model Book has been registered');
    assert.ok(registry.user, 'EmberData model User has been registered');
    assert.equal(
      registry.user.foreignKeys.length,
      1,
      'EmberData model User has the correct relationships'
    );
    assert.equal(
      registry.book.foreignKeys.length,
      1,
      'EmberData model Book has the correct relationships'
    );
    assert.equal(
      registry.user.foreignKeys[0],
      'bookIds',
      'EmberData model User has the correct relationships'
    );
    assert.equal(
      registry.book.foreignKeys[0],
      'userId',
      'EmberData model Book has the correct relationships'
    );
  });

  test(`It works with nested models`, function (assert) {
    let { schema } = this.server;
    let registry = schema._registry;

    assert.ok(
      registry['things/watch'],
      'Model things/watch has been registered'
    );
  });

  test(`Defined Mirage models take precedence over autogenerated ones`, function (assert) {
    let { schema } = this.server;
    let registry = schema._registry;

    assert.ok(registry.tag, 'Model Tag has been registered');
    assert.ok(
      registry.tag.class.__isCustom__,
      'Model Tag is not the autogenerated one'
    );
  });

  test(`Auto generated models can be extended via modelFor`, function (assert) {
    let { schema } = this.server;
    let registry = schema._registry;

    assert.ok(registry.book, 'Ember data model Book has been registered');
    assert.ok(modelFor('book'), 'Ember data model Book is found');
    assert.equal(
      typeof modelFor('book').extend,
      'function',
      'Ember data model Book can be extended'
    );
  });

  test(`modelFor is only for auto generated models`, function (assert) {
    assert.notOk(
      modelFor('tag').__isCustom__,
      'Tag model is not the pre defined one'
    );
    assert.throws(
      () => modelFor('foo'),
      /Model of type 'foo' does not exist/,
      'Pre defined mirage models cannot be found via modelFor'
    );
  });
});
