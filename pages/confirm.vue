<template>
    <div class="container">
        <h2>内容確認</h2>
        <table>
            <tr>
                <th>お名前</th>
                <td>{{$store.state.contact.contact.lastName}} {{$store.state.contact.contact.firstName}}</td>
            </tr>
            <tr>
                <th>性別</th>
                <td>{{$store.state.contact.contact.gender}}</td>
            </tr>
            <tr>
                <th>メールアドレス</th>
                <td>{{$store.state.contact.contact.email}}</td>
            </tr>
            <tr>
                <th>郵便番号</th>
                <td>{{$store.state.contact.contact.postCode}}</td>
            </tr>
            <tr>
                <th>住所</th>
                <td>{{$store.state.contact.contact.address}}</td>
            </tr>
            <tr>
                <th>建物名</th>
                <td>{{$store.state.contact.contact.buildingName}}</td>
            </tr>
            <tr>
                <th>ご意見</th>
                <td>{{$store.state.contact.contact.option}}</td>
            </tr>
        </table>
        <button class="send-btn" @click="send">送信</button>
        <nuxt-link to="/" class="fix">修正する</nuxt-link>
    </div>
</template>

<script>
export default {
    methods: {
        async send() {
            if(this.$store.state.contact.contact.gender == "男性") {
                    const sendGender = 1;
                    const sendData = {
                    fullname: this.$store.state.contact.contact.lastName + this.$store.state.contact.contact.firstName,
                    gender: sendGender,
                    email: this.$store.state.contact.contact.email,
                    postcode: this.$store.state.contact.contact.postCode,
                    address: this.$store.state.contact.contact.address,
                    building_name:this.$store.state.contact.contact.buildingName,
                    option: this.$store.state.contact.contact.option
            }
            await this.$axios.post("http://localhost:8000/api/contact", sendData);
            this.$store.commit("contact/contactClear")
            this.$router.push("/thanks");
            }else {
                    const sendGender = 2;
                    const sendData = {
                    fullname: this.$store.state.contact.contact.lastName + this.$store.state.contact.contact.firstName,
                    gender: sendGender,
                    email: this.$store.state.contact.contact.email,
                    postcode: this.$store.state.contact.contact.postCode,
                    address: this.$store.state.contact.contact.address,
                    building_name:this.$store.state.contact.contact.buildingName,
                    option: this.$store.state.contact.contact.option
                }
                await this.$axios.post("http://localhost:8000/api/contact", sendData);
                this.$store.commit("contact/contactClear")
                this.$router.push("/thanks");
            }
        }
    }
}
</script>

<style scoped>
.container {
  width: 50%;
  margin: 30px auto 0;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.4rem;
}
table {
    border-collapse: separate;
    width: 80%;
    margin: 0 auto;
    font-size: 1.3rem;
    border-spacing: 35px;
    table-layout: fixed;
}
table tr{
    width: 100%;
}
table th {
    width: 30%;
    text-align: left;
}
table td {
    width: 70%;
    overflow-wrap : break-word;
}
.send-btn {
    margin: 10px auto 15px;
    display: block;
    width: 150px;
    padding: 8px 20px;
    font-size: 1.2rem;
    background-color: #000;
    color: #fff;
    box-shadow: 2px 2px #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}
.fix {
    display: block;
    text-align: center;
    margin-bottom: 50px;
    font-size: 1.2rem;
    color: inherit;
}
</style>