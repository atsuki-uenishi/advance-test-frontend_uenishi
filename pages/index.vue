<template>
  <div class="container">
    <h2>お問い合わせ</h2>
    <validation-observer ref="obs" v-slot="{ invalid }" >
        <div class="name flex">
          <label>お名前 <span class="red">※</span></label>
          <validation-provider v-slot="{ errors }" rules="required">
          <div class="lastname">
            <input v-model="lastName" id="lastname" type="text" name="苗字" />
            <p class="example">例）山田</p>
            <div class="error">{{ errors[0] }}</div>
          </div>
        </validation-provider>
        <validation-provider v-slot="{ errors }" rules="required">
          <div class="firstname">
            <input v-model="firstName" id="firstname" type="text" name="名前" />
            <p class="example">例）太郎</p>
            <div class="error">{{ errors[0] }}</div>
          </div>
        </validation-provider>
        </div>
        <div class="gender">
          <label>性別 <span class="red">※</span></label>
          <input type="radio" name="gender" value="男性" v-model="gender" checked/><label class="radio-label">男性</label>
          <input type="radio" name="gender" value="女性" v-model="gender" /><label class="radio-label">女性</label>
        </div>
        <div class="email flex">
          <label for="email">メールアドレス <span class="red">※</span></label>
          <validation-provider v-slot="{ errors }" rules="required|email">
          <input v-model="email" id="email" type="email" name="メールアドレス" />
          <p class="example">例）test@example.com</p>
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>
        </div>
        <div class="postcode flex">
          <label for="postCode">郵便番号 <span class="red">※</span></label>
          <validation-observer ref="obs" v-slot="{ invalid }" >
          <validation-provider v-slot="{ errors }" rules="required|postCodeRule:8|dash">
          <div class="flex">
            <div>
            <a>〒 </a><input type="text" v-model="postCode" id="postCode" name="郵便番号"  @input="toReplace(postCode)">
            <p class="example">例）123-4567</p>
            <div class="error">{{ errors[0] }}</div>
            </div>
            <div>
              <button class="btn postcode-btn" @click="searchAddress(invalid)">郵便番号から住所を入力</button>
              <p class="error" v-show="errorPostcode">郵便番号を入力してください</p>
            </div>
          </div>
        </validation-provider>
        </validation-observer>
        </div>
        <div class="addres flex">
          <label for="addres">住所 <span class="red">※</span></label>
          <validation-provider v-slot="{ errors }" rules="required">
          <input v-model="address" id="addres" type="text" name="住所" />
          <p class="example">例）東京都渋谷区千駄ヶ谷1-2-3</p>
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>
        </div>
        <div class="buildingName flex">
          <label for="buildingName">建物名</label>
          <div class="building-box">
            <input type="text" v-model="buildingName" name="buildingName" id="buildingName">
            <p class="example">例）千駄ヶ谷マンション</p>
          </div>
        </div>
        <div class="option flex">
          <label for="option">ご意見 <span class="red">※</span></label>
          <validation-provider v-slot="{ errors }" rules="required|max:120">
          <textarea v-model="option" name="ご意見" id="option" cols="40" rows="7" />
          <div class="error">{{ errors[0] }}</div>
        </validation-provider>
        </div>
    <button type="button" class="btn confirm-btn" @click="confirm(invalid)">確認</button>
    <p class="error confirm-error" v-show="errorConfirm">必要事項を入力してください</p>
  </validation-observer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastName: "",
      firstName: "",
      gender: "",
      email: "",
      postCode: "",
      address: "",
      buildingName: "",
      option: "",
      errorPostcode: false,
      errorConfirm: false
    }
  },
  methods: {
    toReplace(value) {
      this.postCode = String(value).replace(/[！-～]/g, function(all) {
        return String.fromCharCode(all.charCodeAt(0) - 0xFEE0);
    }).replace(/[‐－―ー]/g,'-');
    },
    async searchAddress(error) {
      if(!error){
        const search = this.postCode.slice(0,this.postCode.indexOf("-")) + this.postCode.slice(this.postCode.indexOf("-") + 1);
        const result = await this.$axios.get("https://apis.postcode-jp.com/api/v4/postcodes/" + search, {"apikey": "jVQZhrR1MVBMQUeVFvMg8rArqqqfVzXb765e1bY"});
        const resData = result.data[0]
        this.address = resData.allAddress
        this.errorPostcode = false;
      } else {
        this.errorPostcode = true;
      }
      
    },
    keepSet() {
      if(this.$store.state.contact.contact) {
        this.firstName = this.$store.state.contact.contact.firstName;
        this.lastName = this.$store.state.contact.contact.lastName;
        this.gender = this.$store.state.contact.contact.gender;
        this.email = this.$store.state.contact.contact.email;
        this.postCode = this.$store.state.contact.contact.postCode;
        this.address = this.$store.state.contact.contact.address;
        this.buildingName = this.$store.state.contact.contact.buildingName;
        this.option = this.$store.state.contact.contact.option;
      }
    },
    confirm(invalid) {
      if(!invalid) {
        if(this.$store.state.contact.contact) {
        this.$store.commit("contact/contactClear");
      }
      const sendData = {
        firstName: this.firstName,
        lastName: this.lastName,
        gender: this.gender,
        email: this.email,
        postCode: this.postCode,
        address: this.address,
        buildingName: this.buildingName,
        option: this.option,
      }
      this.$store.commit("contact/contactKeep",sendData)
      this.$router.push("/confirm");
      } else {
        this.errorConfirm = true;
      }
    }
  },
  created() {
    this.keepSet();
  }
}
</script>


<style scoped>
.container {
  width: 50%;
  margin: 100px auto 50px;
}
h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.5rem;
}
.red {
  color: red;
}
.eroor {
  font-size: .8rem;
  color: red;
}
.example {
  font-size: .9rem;
  color: #aaa;
  margin-top: 4px;
}
.btn {
  background-color: #000;
  color: #fff;
  box-shadow: 2px 2px #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.option label {
  vertical-align: top;
}

input {
  width: 80%;
  border-radius: 5px;
  border: 1px solid #444;
  font-size: 1.1rem;
}

label {
  font-weight: bold;
  margin-right: 100px;
}

.name {
  margin-bottom: 20px;
}

.name label{
  padding-top: 10px;
}
.name input {
  height: 35px;
  width: 90%;
  margin-right: 50px;
}

.gender {
  margin-bottom: 30px;
}

.gender input {
  width: 30px;
  margin-right: 10px;
  transform: scale(2);
}
.radio-label {
    margin-right: 30px;
    vertical-align: middle;
}

.email {
  margin-bottom: 30px;
}
.email label {
  margin-right: 40px;
  padding-top: 8px;
}
.email input {
  height: 35px;
  width: 100%;
}
.email span {
  width: 65%;
}

.postcode {
  margin-bottom: 30px;
}

.postcode label {
  width: 120px;
  margin-right: 80px;
}

.postcode input {
  width: 80%;
  height: 35px;
}
.postcode span {
  width: 100%;
}
.postcode-btn {
  padding: 3px 8px;
  display: inline-block;
  height: 40px;
  width: 255px;
  font-size: 1.1rem;
  margin-bottom: 5px;
}
.postcode .example {
  margin-left: 20px;
}


.addres {
  margin-bottom: 30px;
}

.addres label {
  margin-right: 120px;
}

.addres input {
  height: 35px;
  width: 100%;
}

.addres span {
  width: 65%;
}

.buildingName {
  margin-bottom: 30px;
}

.buildingName label {
  margin-right: 125px;
}

.buildingName input {
  width: 100%;
  height: 35px;
}

.building-box {
  width: 65%;
}

.option {
  margin-bottom: 30px;
}

.option span {
  width: 67%;
}

textarea{
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #000;
    outline: none;
    resize: none;
    border-radius: 10px;
    }

.confirm-btn {
  margin: 0 auto 10px;
  display: block;
  width: 150px;
  padding: 8px 20px;
  font-size: 1.2rem;
}

.error {
  color: red;
  font-size: .9rem;
  font-weight: bold;
}
.confirm-error {
  text-align: center;
}
</style>
