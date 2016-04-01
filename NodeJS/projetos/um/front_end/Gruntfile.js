module.exports = function(grunt) {
    
    /**
    * Configure the various tasks and plugins that we'll be using
    */
    grunt.initConfig({
        /* Grunt's 'file' API provides developers with helpful abstractions for
        interacting with the file system. We'll take a look at these in greater
        detail later in the chapter. */
        'pkg': grunt.file.readJSON('package.json'),
        'my_src_files': ['public/js/*.js'],
        'concat': {
            options: {
                separator: ';'
            },
            dist: {
                //src: ['public/js/**/*.js'],
                src: ['<%= my_src_files %>'],
                //dest: 'dist/<%= pkg.name %>.js'
                dest: 'public/js/dist/app.cat.js'
            }
        },
        'uglify': {
            // uglify task configuration goes here.
            'development': {
                'files': {
                    'build/js/app.min.js': ['public/js/dist/app.cat.js', 'public/bower_components/jquery/dist/jquery.js']
                }
            }
        }
        
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    /**
    * Grunt plugins exist as Node packages, published via npm. Here, we load the
    * 'grunt-contrib-uglify' plugin, which provides a task for merging and minifying
    * a project's source code in preparation for deployment.
    */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    /**
    * Here we create a Grunt task named 'default' that does nothing more than call
    * the 'uglify' task. In other words, this task will serve as an alias to
    * 'uglify'. Creating a task named 'default' tells Grunt what to do when it is
    * run from the command line without any arguments. In this example, our 'default'
    * task calls a single, separate task, but we could just as easily have called
    * multiple tasks (to be run in sequence) by adding multiple entries to the array
    * that is passed.
    */
    grunt.registerTask('default', ['concat', 'uglify']);
    
    /**
    * Here we create a custom task that prints a message to the console (followed by
    * a line break) using one of Grunt's built-in methods for providing user feedback.
    * We'll look at these in greater detail later in the chapter.
    */
    grunt.registerTask('hello-world', function() {
        grunt.log.writeln('Hello, world.');
    });
    
};