module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect:{
      //这里为插件子刷新方式
      options: {
        port: 1013,
        hostname: '10.240.138.72', //默认就是这个值，可配置为本机某个 IP，localhost 或域名
        livereload: 35737  //声明给 watch 监听的端口
      },
      server: {
        options: {
          open: true, //自动打开网页 http://
          base: [
            'webapp'  //主目录
            ]
          }
        }

    },
    cssmin:{
      bulid:{
        expand:true,
        cwd:"webapp/style/css",
        src:"*.css",
        dest:"webapp/style/css",
        ext:".min.css"
      }
    },
    html_template: {
      options: {
        force: true,
        autoescape: true,
        cache: false,
        varControls: ['{{', '}}'],
        tagControls: ['{%', '%}'],
        cmtControls: ['{#', '#}'],
        locals:  {},
        beautify: {
          indent_size: 4
        }
      },
      dev: {
        options: {
          force: false
        },
        expand: true,
        cwd: "webapp/components/",
        src: "*.html",
        dest: "webapp/"
      },
      build: {
        expand: true,
        cwd: "webapp/components/",
        src: "*.html",
        dest: "webapp/"
      }
    },
    sass: {
        dist: {
            options: {                       // Target options
            style: 'expanded'
          },
          files: {
            "webapp/style/css/pc.css":"webapp/style/scss/pc.scss",
            "webapp/style/css/phone.css":"webapp/style/scss/phone.scss"
          }
       }
    },
    compass: {
      dist: {
        options: {
          config: 'webapp/style/config.rb'
        }
      }
    },
    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'webapp/js/label/es5/label.js': 'webapp/js/label/es6/label.js'
            }
        }
    },
    watch: {
      scripts: {
        files: ['webapp/js/**/*.js'],
        tasks: ['babel'],
        options: {
          spawn: false,
        }
      },
      sass: {
        files: ['webapp/style/**/*.{scss,sass}'],
        tasks: ['sass']
      },
      html:{
        files: ['webapp/components/**/*.html'],
        tasks: ['html_template:build']
      },
      livereload: {
        options: {
                  livereload:'<%=connect.options.livereload%>'  //监听前面声明的端口  35729
                },
                files:[  //下面文件的改变就会实时刷新网页
                'webapp/**/*.html',
                'webapp/style/{,*/}*.css',
                'webapp/js/{,*/}*.js',
                'webapp/img/{,*/}*.{png,jpg}'
          ]
      }
    }
  });

  grunt.registerTask('default', ['connect:server', 'watch','html_template:build']);
  grunt.registerTask('build', ['cssmin:bulid']);
};
