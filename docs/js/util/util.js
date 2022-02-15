var util = {

    secondsToHms: function (d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + "h " : "";
        var mDisplay = m > 0 ? m + "m " : "00m ";
        var sDisplay = s > 0 ? (s < 10 ? "0" : "") + s + "s " : "00s";
        return hDisplay + mDisplay + sDisplay;
    },

    bind: function (func, context) {

        if (this.isFunction(Function.prototype.bind)) {
            return Function.prototype.bind.apply(func, Array.prototype.slice.call(arguments, 1));
        }

        if (arguments.length < 2 && this.isUndefined(arguments[0])) {
            return func;
        }

        var args = Array.prototype.slice.call(arguments, 2);

        function update(array, args) {
            var arrayLength = array.length,
                length = args.length;
            while (length--) {
                array[arrayLength + length] = args[length];
            }
            return array;
        }
        function merge(array, args) {
            array = Array.prototype.slice.call(array, 0);
            return update(array, args);
        }

        return function () {
            return func.apply(context, merge(args, arguments));
        };
    },

    isFunction: function (obj) {
        return typeof obj === "function" || false;
    },

    isUndefined: function (obj) {
        return typeof obj === "undefined";
    },

    isArray: Array.isArray ? Array.isArray : function (obj) {

        //Information  on the best way to perform this type of check is taken from:
        // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
        return Object.prototype.toString.call(obj) === "[object Array]";
    },

    isPlainObject: function (obj) {
        if (!obj || typeof obj !== "object" || obj.nodeType) {
            return false;
        }

        // Not own constructor property must be Object
        if (obj.constructor && !obj.hasOwnProperty("constructor") && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
            return false;
        }

        //Loop through all properties to get access to the last one.
        var key;
        for (key in obj) { }

        //Own properties are iterated first, so it is enough to look at the last one.
        return (key === undefined || obj.hasOwnProperty(key));
    },

    breaker: {},

    checkType: function () {
        if (this.isArray(arguments[0])) {
            return true;
        }
        if (this.isPlainObject(arguments[0])) {
            return false;
        }

        return false;
    },

    each: function (target, iter, context) {
        var arr, i, len, key, value, pair, object;
        iter = iter || function (x) {
            return x;
        };
        if (!this.isFunction(iter)) {
            return;
        }
        if (this.checkType(target)) {
            arr = target;

            // it is not possible to break a forEach natively, so we use some function instead
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
            if (this.isFunction(Array.prototype.some)) {
                arr.some(function () {
                    // workaround, check if this.breaker is returned from iter function
                    return (iter.apply(context, arguments) === this.breaker);
                }, context);
                return;
            }

            i = 0;
            len = arr.length;
            for (; i < len; i++) {
                if (iter.call(context, arr[i], i, arr) === this.breaker) {
                    return;
                }
            }
            return;
        }
        object = target;
        for (key in object) { // eslint-disable-line guard-for-in
            value = object[key];
            pair = [key, value];
            pair.key = key;
            pair.value = value;
            if (iter.call(context, pair) === this.breaker) {
                return;
            }
        }
    },

    /**
     * iterate over the array and return the first element that callback function returns turthy
     * @method findIndex
     * @param {Array} arr Array to search in
     * @param {Function} iter Iterator function to use for testing (returns true for pass, false for fail)
     * @param {Object} context Scope of the iterator
     * @return {Number} index of first found element
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * util.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // 2
     */
    findIndex: function (arr, iter, context) {
        var index = -1,
            length = arr ? arr.length : 0;

        iter = iter || function (x) {
            return x;
        };

        while (++index < length) {
            if (iter.call(context, arr[index], index, arr)) {
                return index;
            }
        }
        return -1;
    },

    /*
     * iterate over the array and return the first element that callback function returns turthy
     * @method find
     * @memberof module:xdk-base/util
     * @param {Array} arr Array to search in
     * @param {Function} iter Iterator function to use for testing (returns true for pass, false for fail)
     * @param {Object} context Scope of the iterator
     * @return {Number} first found element
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * util.find(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // { 'name': 'pebbles', 'age': 1,  'blocked': false }
     */
    find: function (arr, iter, context) {
        var index = util.findIndex(arr, iter, context);
        return index > -1 ? arr[index] : undefined;
    }


};
