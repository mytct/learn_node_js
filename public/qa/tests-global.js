var assert = require('assert');
suite('Global Tests', function(){
    test('page has a valid title', function(){
        console.log('Global Tests document.title ' + document.title);
        assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
    });
});