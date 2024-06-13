// 引入createApp用于创建应用
import {createApp} from 'vue'
// 引入App根组件
import App from './App.vue'

// // 引入路由器
// import router from './src/router'

//整体导入 ElementPlus 组件库
import ElementPlus from 'element-plus' //导入 ElementPlus 组件库的所有模块和功能 
import 'element-plus/dist/index.css' //导入 ElementPlus 组件库所需的全局 CSS 样式
// // 创建一个应用
const app = createApp(App)

app.use(ElementPlus) //将 ElementPlus 插件注册到 Vue 应用中
// 挂载整个应用到app容器中
app.mount('#app')