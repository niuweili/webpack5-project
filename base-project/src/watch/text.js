
export default {
    render() {
        function importClick(){
            console.log('text component click')
        }
        return (
            <div>
                <h1 onClick={importClick}>动态import组件</h1>
            </div>
        )
    }
}
