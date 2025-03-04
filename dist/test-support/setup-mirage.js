import { assert } from '@ember/debug';
import { settled } from '@ember/test-helpers';
import { createServer } from 'miragejs';

function setupMirage(hooks = self, {
  createServer: createServer$1,
  config
}) {
  assert(`Unexpected arity for setupMirage. Expected 2 (hooks, { createServer, or config })`, arguments.length <= 2 && arguments.length > 0);
  assert(`Second argument to setupMirage must be an object and not null`, typeof arguments[1] === 'object' && arguments[1] !== null);
  assert(`Second argument to setupMirage must on or both of createServer and/or config. You passed ${Object.keys(arguments[1]).join(', ')}`, 'createServer' in arguments[1] || 'config' in arguments[1]);
  createServer$1 ??= createServer;
  hooks.beforeEach(async function () {
    if (!this.owner) {
      throw new Error('You must call one of the ember-qunit setupTest(),' + ' setupRenderingTest() or setupApplicationTest() methods before' + ' calling setupMirage()');
    }
    const store = this.owner.lookup("service:store");
    this.server = await createServer$1(config ?? {}, store);
    if (this.server.start) {
      await this.server.start();
    }
  });
  hooks.afterEach(function () {
    return settled().then(() => {
      if (this.server) {
        this.server.shutdown();
        delete this.server;
      }
    });
  });
}

export { setupMirage };
//# sourceMappingURL=setup-mirage.js.map
