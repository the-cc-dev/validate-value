'use strict';

const assert = require('assertthat');

const schemas = require('../shared/schemas'),
      Value = require('../../src/Value');

suite('Value', () => {
  test('is a function.', async () => {
    assert.that(Value).is.ofType('function');
  });

  test('throws an error if schema is missing.', async () => {
    assert.that(() => {
      /* eslint-disable no-new */
      new Value();
      /* eslint-enable no-new */
    }).is.throwing('Schema is missing.');
  });

  suite('validate', () => {
    let schema;

    setup(() => {
      schema = new Value(schemas.user);
    });

    test('is a function.', async () => {
      assert.that(schema.validate).is.ofType('function');
    });

    test('throws an error if value is missing.', async () => {
      assert.that(() => {
        schema.validate();
      }).is.throwing('Value is missing.');
    });

    test('does not throw an error if value is a falsy value.', async () => {
      schema = new Value(schemas.boolean);

      assert.that(() => {
        schema.validate(false);
      }).is.not.throwing();
    });

    test('throws an error if schema does not match.', async () => {
      assert.that(() => {
        schema.validate({
          username: 'Jane Doe'
        });
      }).is.throwing(ex =>
        ex.message === `Value should have required property 'password'.` &&
        Array.isArray(ex.origins));
    });

    test('does not throw an error if schema matches.', async () => {
      assert.that(() => {
        schema.validate({
          username: 'Jane Doe',
          password: 'secret'
        });
      }).is.not.throwing();
    });
  });

  suite('isValid', () => {
    let schema;

    setup(() => {
      schema = new Value(schemas.user);
    });

    test('is a function.', async () => {
      assert.that(schema.isValid).is.ofType('function');
    });

    test('throws an error if value is missing.', async () => {
      assert.that(() => {
        schema.isValid();
      }).is.throwing('Value is missing.');
    });

    test('does not throw an error if value is a falsy value.', async () => {
      schema = new Value(schemas.boolean);

      assert.that(() => {
        schema.isValid(false);
      }).is.not.throwing();
    });

    test('returns false if schema does not match.', async () => {
      assert.that(schema.isValid({
        username: 'Jane Doe'
      })).is.false();
    });

    test('returns true if schema matches.', async () => {
      assert.that(schema.isValid({
        username: 'Jane Doe',
        password: 'secret'
      })).is.true();
    });
  });
});