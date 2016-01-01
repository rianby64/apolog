'use strict';
// the next test are being performed by using the features from Apolog

loadFeature('./spec/features/params.feature');
describe("it parsers a simple feature", function() {
  var errors;

  feature('Testing parameters', function feature() {
    background(/A background/, function background() {
      given(/a given background ([0-9a-zA-Z]+)/, function given_background(param, table) {
        this.background_table = table;
        this.background_counter = this.background_counter || 0;
        this.background_counter++;

        if (this.background_counter === 3) {
          this.background_flag = "third wind";
        }
        var expect_table = [
            [ 'x1', 'x2', 'x3' ],
            [ 'y1', 'y2', 'y3' ],
            [ 'z1', 'z2', 'z3' ]];
        expect(param).toMatch(/x[0-9]/);
        expect_table.forEach(function(item, i) {
          expect(table[i]).toEqual(jasmine.arrayContaining(item));
        });
      });
    });

    scenario(/Simple scenario ([0-9a-zA-Z]+)/, function scenario(p) {
    });
    scenario(/Another scenario ([0-9a-zA-Z]+)/, function() {
    });

    given(/A given ([0-9a-zA-Z]+)/, function given(param, table, done) {
      var expect_table = [
        [ 'x1', 'x2', 'x3' ],
        [ 'y1', 'y2', 'y3' ],
        [ 'z1', 'z2', 'z3' ]
      ], that = this;
      expect(param).toMatch(/x[0-9]/);
      expect_table.forEach(function(item, i) {
        expect(that.background_table[i]).toEqual(jasmine.arrayContaining(item));
      });

      if (param === "x3") {
        expect(table).toBeUndefined();
      }
      else {
        expect(table).toEqual(jasmine.arrayContaining(['m1', 'm2', 'm3']));
      }
      done();
    });
    when(/A when ([0-9a-zA-Z]+) ([0-9a-zA-Z]+)/, function when(param1, param2, table) {
      expect(this.background_counter).not.toBeUndefined();
      if (this.background_counter === 3) {
        expect(this.background_flag).toBe("third wind");
      }
      expect(table).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
    });
    then(/A step ([0-9a-zA-Z]+)/, function then(param1, param2, param3, table, done) {
      var expect_table = [[ 'm1', 'm2', 'm3' ], [ 'n1', 'n2', 'n3' ]];
      if (table) {
        expect_table.forEach(function(item, i) {
          expect(table[i]).toEqual(jasmine.arrayContaining(item));
        });
      }
      
      expect(param2).toBeUndefined();
      expect(param3).toBeUndefined();

      done();
    });
  });

  errors = run();

  it('running without errors', function() {
    expect(errors.length).toBe(0);
  });
});

