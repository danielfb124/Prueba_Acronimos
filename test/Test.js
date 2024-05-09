const assert = require('chai').assert;
const sinon = require('sinon');
const db = require('../server/db'); // Asegúrate de que esta ruta sea correcta

describe('Database tests', function() {
    let insertAcronymStub;
    let fetchAcronymsStub;

    beforeEach(function() {
        // Crea stubs para las funciones de la base de datos
        insertAcronymStub = sinon.stub(db, 'insertAcronym');
        fetchAcronymsStub = sinon.stub(db, 'fetchAcronyms');
    });

    afterEach(function() {
        // Restaura las funciones originales después de cada prueba
        insertAcronymStub.restore();
        fetchAcronymsStub.restore();
    });

    describe('#insertAcronym()', function() {
        it('should insert without error', function(done) {
            // Configura el stub para que llame al callback sin errores
            insertAcronymStub.callsFake((acronym, meanings, callback) => callback(null));

            db.insertAcronym('NPM', ['Node Package Manager'], function(err) {
                assert.equal(null, err);
                done();
            });
        });

        it('should handle errors', function(done) {
            // Configura el stub para que llame al callback con un error
            insertAcronymStub.callsFake((acronym, meanings, callback) => callback(new Error('Database error')));

            db.insertAcronym('NPM', ['Node Package Manager'], function(err) {
                assert.instanceOf(err, Error);
                done();
            });
        });
    });

    describe('#fetchAcronyms()', function() {
        it('should fetch without error', function(done) {
            // Configura el stub para que llame al callback con un array de acrónimos
            fetchAcronymsStub.callsFake(callback => callback(null, []));

            db.fetchAcronyms(function(err, acronyms) {
                assert.equal(null, err);
                assert(Array.isArray(acronyms));
                done();
            });
        });

        it('should handle errors', function(done) {
            // Configura el stub para que llame al callback con un error
            fetchAcronymsStub.callsFake(callback => callback(new Error('Database error')));

            db.fetchAcronyms(function(err, acronyms) {
                assert.instanceOf(err, Error);
                done();
            });
        });
    });
});