import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { getRequest, postRequest } from '../src/utils/request'
// import axios from 'axios'
import moment from 'moment'
import ElementUi from 'element-ui'
// import {
//   Pagination,
//   Dialog,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Menu,
//   Submenu,
//   MenuItem,
//   MenuItemGroup,
//   Input,
//   InputNumber,
//   Radio,
//   RadioGroup,
//   Checkbox,
//   CheckboxGroup,
//   Select,
//   Option,
//   OptionGroup,
//   Button,
//   ButtonGroup,
//   Table,
//   TableColumn,
//   DatePicker,
//   Popover,
//   Form,
//   FormItem,
//   Tabs,
//   TabPane,
//   Tree,
//   Icon,
//   Row,
//   Col,
//   Upload,
//   Steps,
//   Step,
//   Container,
//   Header,
//   Aside,
//   Main,
//   Footer,
//   Link,
//   Image,
//   Loading,
//   Message,
// } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'lib-flexible'

const isProduct = process.env.NODE_ENV != 'production'
console.log(isProduct);
Vue.config.productionTip = false
Vue.config.debug = isProduct
Vue.config.devtools = isProduct


Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.$store = store
Vue.prototype.$baseUrl = process.env.VUE_APP_HOST

Vue.use(ElementUi)
// Vue.use(Pagination);
// Vue.use(Dialog);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(Menu);
// Vue.use(Submenu);
// Vue.use(MenuItem);
// Vue.use(MenuItemGroup);
// Vue.use(Input);
// Vue.use(InputNumber);
// Vue.use(Radio);
// Vue.use(RadioGroup);
// Vue.use(Checkbox);
// Vue.use(CheckboxGroup);
// Vue.use(Select);
// Vue.use(Option);
// Vue.use(OptionGroup);
// Vue.use(Button);
// Vue.use(ButtonGroup);
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(DatePicker);
// Vue.use(Popover);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Tabs);
// Vue.use(TabPane);
// Vue.use(Tree);
// Vue.use(Icon);
// Vue.use(Row);
// Vue.use(Col);
// Vue.use(Upload);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Container);
// Vue.use(Header);
// Vue.use(Aside);
// Vue.use(Main);
// Vue.use(Footer);
// Vue.use(Link);
// Vue.use(Image);
// Vue.use(Message);

// Vue.use(Loading.directive);
Vue.filter('time', function (input) {
  return moment(input).format('YYYY-MM-DD')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
