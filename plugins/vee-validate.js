import Vue from 'vue';
import { ValidationProvider, ValidationObserver, extend, localize, validate } from 'vee-validate';
import * as originalRules from 'vee-validate/dist/rules';
import ja from 'vee-validate/dist/locale/ja.json';

let rule;
for (rule in originalRules) {
  extend(rule, {
    ...originalRules[rule],
  });
}

const postCodeRule = {
  params: ['length'],
  message: '{_field_}は{length}文字で入力してください。',
  validate(value, {length}) {
    return value.length == length
  }
};
extend('postCodeRule', postCodeRule)

const dash = {
  params: ['dash'],
  message: 'ハイフン(-)を入れてください',
  validate(value) {
    return value.includes('-');
  }
}
extend('dash', dash)

localize('ja', ja);

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);