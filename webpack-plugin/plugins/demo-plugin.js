class DemoPlugin {
    constructor(options) {
        this.options = options
    }

    apply(complier) {
        console.log('this demo plugin')
        console.log('this demo plugin options', this.options)
    }
}

module.exports = DemoPlugin