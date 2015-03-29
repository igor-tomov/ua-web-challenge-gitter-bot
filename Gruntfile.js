module.exports = function( grunt ){
    grunt.initConfig({
        jshint: {
            files: ['gitter-bot/*.js'],
            options: {
                evil: true,
                globals: {
                    console: true,
                    node: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('default', ['jshint']);
};