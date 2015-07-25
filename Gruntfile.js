module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/js/_intro.js',
          'src/js/main.js',
          'src/js/_outro.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    sass: {
      dist: {
        files: {
          'dist/styles/imagerazor.css':'src/styles/index.scss'
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/styles/imagerazor.min.css': 'dist/styles/imagerazor.css'
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: ['images/*.*'],
            dest: 'dist/'

          },
          {
            expand: true,
            cwd: 'src/',
            src: ['fonts/*.*'],
            dest: 'dist/'

          }
        ]
      }
    },

    qunit: {
      files: ['test/*.html']
    },

    jshint: {
      files: ['dist/ImageRazor.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['src/js/*.js', 'src/styles/**/*.scss'],
      tasks: ['sass', 'concat']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['copy', 'sass', 'concat']);
  grunt.registerTask('build', ['copy', 'sass', 'cssmin', 'concat', 'uglify']);

};
