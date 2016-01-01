module.exports = {
    brunch : {
        paths: {
            watched: ['assets', 'app', 'test', 'vendor']
        },
        files: {
            javascripts: {
                defaultExtension: 'js',
                joinTo: {
                    'resources/javascripts/vendor.js': /^vendor/,
                    'resources/javascripts/app.js': /^app/,
                    'test/javascripts/test.js': /^test/
                },
                order: {
                    before: []
                }
            },
            stylesheets: {
                defaultExtension: 'css',
                joinTo: {
                    'resources/stylesheets/app.css': /^app/,
                    'resources/stylesheets/vendor.css': /^vendor/
                }
            },
            templates: {
                defaultExtension: 'hbs',
                joinTo: {
                    'resources/javascripts/app.js' : /^app/
                }
            }
        },
        plugins: {
            assetsmanager: {
                copyTo: {
                    'resources/bower_components' : ['bower_components']
                }
            },
            jshint: {
                pattern: /^app\/.*\.js$/,
                options: {
                    //Enforcing options. When set to true - produces more warnings
                    bitwise: true, /* This option prohibits the use of bitwise operators such as ^ (XOR), | (OR) and others. Bitwise operators are very rare in JavaScript programs and quite often & is simply a mistyped &&. */
                    camelcase: false,
                    eqeqeq: true, /* This options prohibits the use of == and != in favor of === and !==. The former try to coerce values before comparing them which can lead to some unexpected results. The latter don't do any coercion so they are generally safer. If you would like to learn more about type coercion in JavaScript, we recommend Truth, Equality and JavaScript by Angus Croll. */
                    curly: false, /* This option requires you to always put curly braces around blocks in loops and conditionals. JavaScript allows you to omit curly braces when the block consists of only one statement*/
                    es3: true, /* This option tells JSHint that your code needs to adhere to ECMAScript 3 specification. Use this option if you need your program to be executable in older browsers—such as Internet Explorer 6/7/8/9—and other legacy JavaScript environments. Warns on extra comma, etc.*/
                    forin: true, /* This option requires all for in loops to filter object's items.  */
                    immed: false, /* This option prohibits the use of immediate function invocations without wrapping them in parentheses. Wrapping parentheses assists readers of your code in understanding that the expression is the result of a function, and not the function itself. */
                    indent: false, /* This option enforces specific tab width for your code. For example, the following code will trigger a warning on line 4: */
                    latedef: true, /* This option prohibits the use of a variable before it was defined. JavaScript has function scope only and, in addition to that, all variables are always moved—or hoisted— to the top of the function. This behavior can lead to some very nasty bugs and that's why it is safer to always use variable only after they have been explicitly defined. Setting this option to "nofunc" will allow function declarations to be ignored. */
                    newcap : false, /* This option requires you to capitalize names of constructor functions. Capitalizing functions that are intended to be used with new operator is just a convention that helps programmers to visually distinguish constructor functions from other types of functions to help spot mistakes when using this. */
                    noarg: true, /* This option prohibits the use of arguments.caller and arguments.callee. Both .caller and .callee make quite a few optimizations impossible so they were deprecated in future versions of JavaScript. In fact, ECMAScript 5 forbids the use of arguments.callee in strict mode. */
                    noempty: true, /* This option warns when you have an empty block in your code. JSLint was originally warning for all empty blocks and we simply made it optional. There were no studies reporting that empty blocks in JavaScript break your code in any way. */
                    nonew: false, /* This option prohibits the use of constructor functions for side-effects. Some people like to call constructor functions without assigning its result to any variable */
                    plusplus: false, /* This option prohibits the use of unary increment and decrement operators. Some people think that ++ and -- reduces the quality of their coding styles and there are programming languages—such as Python—that go completely without these operators. */
                    quotmark: false, /* This option enforces the consistency of quotation marks used throughout your code. It accepts three values: true if you don't want to enforce one particular style but want some consistency, "single" if you want to allow only single quotes and "double" if you want to allow only double quotes. */
                    undef: true, /* This option prohibits the use of explicitly undeclared variables. This option is very useful for spotting leaking and mistyped variables. */
                    unused: true, /* This option warns when you define and never use your variables. It is very useful for general code cleanup, especially when used in addition to undef. */
                    trailing: false, /* This option makes it an error to leave a trailing whitespace in your code. Trailing whitespaces can be source of nasty bugs with multi-line strings in JavaScript */

                    //Relaxing options. When set to true, produces LESS warnings
                    sub: false, /* This option supresses warnings about using [] notation when it can be expressed in dot notation: person['name'] vs. person.name. */


                    //Environment options.
                    supernew: true,
                    devel: true, /* This option defines globals that are usually used for logging poor-man's debugging: console, alert, etc. It is usually a good idea to not ship them in production because, for example, console.log breaks in legacy versions of Internet Explorer. */
                    jquery: true, /* This option defines globals exposed by the jQuery JavaScript library. */
                    browser: true /* This option defines globals exposed by modern browsers: all the way from good old document and navigator to the HTML5 FileReader and other new developments in the browser world. */

                },
                "globals": {
                     JSON: true,
                     require: true,
                     module: true,
                     debounce: true,
                     L: true,
                     $M: true,
                     $V: true,
                     Matrix: true,
                     Handlebars: true,
                     JSON: true,
                     Sortable: true
                }
            }
        },
        keyword: {
            filePattern: /\.(js|css|html)$/,
            map: {
                ENV: 'DEV'
            }
        }
    }
}
