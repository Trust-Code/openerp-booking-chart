
openerp.unleashed.module('booking_chart', function(booking, _, Backbone){
        
    openerp.testing.section('DateRange', function (test) {
   
        // force moment language to english
        moment.lang('en');
    
        var DateRange = booking.models('DateRange');
        
        var fill = function(number, size) {
            number = number.toString();
            while (number.length < size) number = "0" + number;
            return number;
        };
        
        var momentEqual = function(m1, m2, msg){
            m1 = m1 instanceof moment ? m1 : moment(m1);
            m2 = m2 instanceof moment ? m2 : moment(m2);
            strictEqual.apply(this, [m1.format('YYYY-MM-DD'), m2.format('YYYY-MM-DD'), msg]);
        };
        
        test('set', function () {
            
            // set at instanciation
            var period1 = new DateRange({
                start: moment('2013-06-01'),
                end: moment('2013-08-01')
            });
        
            momentEqual(period1.get('start'), period1.get('added_start'), 'constructor: added start and start are equal');
            momentEqual(period1.get('end'), period1.get('added_end'), 'constructor: added end and end are equal');
            
            strictEqual(period1.timelapses.length, 3, 'constructor: months collection has 3 elements');
            period1.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(6 + index, 2);
                strictEqual(month.get('id'), month_id, 'constructor: month id ' + month_id + ' is correct');
            });
            
            //set with the "set" method
            var period2 = new DateRange();
            period2.set({
                start: moment('2013-06-01'),
                end: moment('2013-08-01')
            });
        
            momentEqual(period2.get('start'), period2.get('added_start'), 'set method: added start and start are equal');
            momentEqual(period2.get('end'), period2.get('added_end'), 'set method: added end and end are equal');
            
            strictEqual(period2.timelapses.length, 3, 'set method: months collection has 3 elements');
            period2.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(6 + index, 2);
                strictEqual(month.get('id'), month_id, 'set method: month id ' + month_id + ' is correct');
            });
        });
            
        test('change', function () {

            var period1 = new DateRange({
                start: moment('2013-06-01'),
                end: moment('2013-08-01')
            });
            
            period1.nextTimelapse();
            
            momentEqual(period1.get('start'), '2013-06-01', 'nextTimelapse: start is 2013-06-01');
            momentEqual(period1.get('end'), '2013-09-30', 'nextTimelapse: end is 2013-09-30');
            momentEqual(period1.get('added_start'), '2013-09-01', 'nextTimelapse: added_start is 2013-09-01');
            momentEqual(period1.get('added_end'), '2013-09-30', 'nextTimelapse: added_end is 2013-09-30');
            
            period1.previousTimelapse();
            
            momentEqual(period1.get('start'), '2013-05-01', 'previousTimelapse: start is 2013-05-01');
            momentEqual(period1.get('end'), '2013-09-30', 'previousTimelapse: end is 2013-09-30');
            momentEqual(period1.get('added_start'), '2013-05-01', 'previousTimelapse: added_start is 2013-05-01');
            momentEqual(period1.get('added_end'), '2013-05-31', 'previousTimelapse: added_end is 2013-05-31');

            var period2 = new DateRange({
                start: moment('2013-06'),
                end: moment('2013-08')
            });
            
            period2.reachTimelapseCount(6);

            momentEqual(period2.get('start'), '2013-06-01', 'reachTimelapseCount: start is 2013-06-01');
            momentEqual(period2.get('end'), '2013-11-30', 'reachTimelapseCount: end is 2013-11-30');
            momentEqual(period2.get('added_start'), '2013-09-01', 'reachTimelapseCount: added_start is 2013-09-01');
            momentEqual(period2.get('added_end'), '2013-11-30', 'reachTimelapseCount: added_end is 2013-11-30');
        });
        
        test('months Collection', function(){
            // set at instanciation
            var period = new DateRange({
                start: moment('2013-06-01'),
                end: moment('2013-08-01')
            });
            
            strictEqual(period.timelapses.length, 3, 'months collection has 3 elements');

            period.timelapses.once('add', function(model){
                strictEqual(model.id, '2013-09', 'next: 2013-09 added');
                strictEqual(model.get('days').length, 30, 'next: 2013-09 has 30 days');
            });
            
            period.nextTimelapse();
            
            strictEqual(period.timelapses.length, 4, 'next: timelapses collection has 4 elements');
            period.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(6 + index, 2);
                strictEqual(month.get('id'), month_id, 'next: month id ' + month_id + ' is correct');
            });
            
            period.timelapses.once('add', function(model){
                strictEqual(model.id, '2013-05', 'previous: 2013-05 added');
                strictEqual(model.get('days').length, 31, 'previous: 2013-05 has 31 days');
            });
            
            period.previousTimelapse();
            
            strictEqual(period.timelapses.length, 5, 'previous: timelapses collection has 5 elements');
            period.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(5 + index, 2);
                strictEqual(month.get('id'), month_id, 'previous: month id ' + month_id + ' is correct');
            });
            
            period.nextTimelapse(2);
            
            strictEqual(period.timelapses.length, 7, 'next 2: timelapses collection has 7 elements');
            period.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(5 + index, 2);
                strictEqual(month.get('id'), month_id, 'next 2: month id ' + month_id + ' is correct');
            });
            
            period.previousTimelapse(2);
            
            strictEqual(period.timelapses.length, 9, 'previous 2: timelapses collection has 9 elements');
            period.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(3 + index, 2);
                strictEqual(month.get('id'), month_id, 'previous 2: month id ' + month_id + ' is correct');
            });
            
            
            period.timelapses.once('add', function(model){
                strictEqual(model.id, '2013-12', 'reach 10: 2013-12 added');
                strictEqual(model.get('days').length, 31, 'reach 10: 2013-12 has 31 days');
            });
            
            period.reachTimelapseCount(10);
            
            strictEqual(period.timelapses.length, 10, 'reach 10: timelapses collection has 12 elements');
            period.timelapses.each(function(month, index){
                var month_id = '2013-' + fill(3 + index, 2);
                strictEqual(month.get('id'), month_id, 'reach 12: month id ' + month_id + ' is correct');
            });
        });
    });    
});




