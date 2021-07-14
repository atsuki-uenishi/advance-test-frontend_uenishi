<template>
    <div class="container">
        <h2>管理システム</h2>
        <div class="search-box">
            <div class="box">
                <div class="name">
                    <label for="name" class="item-label">お名前</label>
                    <input type="text" id="name" v-model="name">
                </div>
                <div class="gender">
                    <label class="item-label">性別</label>
                    <input type="radio" name="gender" v-model="gender" value="" checked><label>全て</label>
                    <input type="radio" name="gender" v-model="gender" value="男性"><label>男性</label>
                    <input type="radio" name="gender" v-model="gender" value="女性"><label>女性</label>
                </div>
            </div>
            <div class="registrationーdate">
                <label class="item-label">登録日</label>
                <input v-model="dateAfter" type="date"> <span>~</span> <input v-model="dateBefore" type="date">
            </div>
            <div class="email">
                <label for="email" class="item-label">メールアドレス</label>
                <input type="email" v-model="email">
            </div>
            <button class="search-btn btn" @click="search">検索</button>
            <p class="reset" @click="reset">リセット</p>
        </div>
        <div class="contact-list">
            <div class="paginate-box flex" >
                <p>全{{totalItems}}件中 {{showItems}}件</p>
                <paginate
                :page-count="getPageCount"
                :page-range="3"
                :margin-pages="1"
                :click-handler="clickCallback"
                :prev-text="'＜'"
                :next-text="'＞'"
                :container-class="'pagination flex'"
                :page-class="'pagination-item'"
                :page-link-class="'pagination-item__link'"
                :prev-class="'pagination-btn pagination-prev'"
                :prev-link-class="'pagination-btn__link'"
                :next-class="'pagination-btn pagination-next'"
                :next-link-class="'pagination-btn__link'"
                :hide-prev-next="true"
                ></paginate>
            </div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>お名前</th>
                    <th>性別</th>
                    <th>メールアドレス</th>
                    <th>ご意見</th>
                    <th></th>
                </tr>
                <tr v-for="(contact,index) in getItems" :key="index">
                    <td>{{contact.id}}</td>
                    <td>{{contact.fullname}}</td>
                    <td>{{showgender(contact.gender)}}</td>
                    <td>{{contact.email}}</td>
                    <td><p v-on:mouseover="mouseOver(index)" v-on:mouseleave="mouseLeave" v-if="index !== hoverIndex">{{contact.option | limitText}}</p><p v-show="index === hoverIndex">{{contact.option}}</p></td>
                    <td><button class="delete-btn btn" @click="deleteContact(contact.id)">削除</button></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            contacts: [],
            parPage: 10,
            currentPage: 1,
            name: "",
            gender: "",
            dateAfter: "",
            dateBefore: "",
            email: "",
            hoverIndex: ""
        }
    },
    methods: {
        clickCallback: function (pageNum) {
        this.currentPage = Number(pageNum);
        },
        async getContacts() {
            const getData = await this.$axios.get("http://localhost:8000/api/contact");
            this.contacts = getData.data.data
        },
        async deleteContact(id) {
            await this.$axios.delete("http://localhost:8000/api/contact/" + id);
            this.getContacts();
        },
        async search() {
            if(this.gender == "男性" ){
              const gender = 1
              const resData = await this.$axios.get("http://127.0.0.1:8000/api/contact/", {params:{name: this.name, gender: gender, dateAfter: this.dateAfter, dateBefore: this.dateBefore, email: this.email}});
              this.contacts = resData.data.data
            } else if (this.gender == "女性") {
                const gender = 2
                const resData = await this.$axios.get("http://127.0.0.1:8000/api/contact/", {params:{name: this.name, gender: gender, dateAfter: this.dateAfter, dateBefore: this.dateBefore, email: this.email}});
                this.contacts = resData.data.data
            } else {
                const resData = await this.$axios.get("http://127.0.0.1:8000/api/contact/", {params:{name: this.name, dateAfter: this.dateAfter, dateBefore: this.dateBefore, email: this.email}});
                this.contacts = resData.data.data
            }
        },
        reset() {
            this.getContacts();
            this.name = "";
            this.gender = "";
            this.dateAfter = "";
            this.dateBefore = "";
            this.email = "";
        },
        mouseOver(index) {
            this.hoverIndex = index;
        },
        mouseLeave() {
            this.hoverIndex = "";
        }
    },
    computed: {
        getItems() {
        let current = this.currentPage * this.parPage;
        let start = current - this.parPage;
        return this.contacts.slice(start, current);
        },
        getPageCount() {
        return Math.ceil(this.contacts.length / this.parPage);
        },
        showgender() {
            return function(gender) {
                if(gender == 1) {
                    return "男性"
                } else {
                    return "女性"
                }
            }
        },
        totalItems() {
            return this.contacts.length
        },
        showItems() {
            if(this.contacts.length === 0) {
                return 0 + "~" + 0
            }
            if(this.contacts.length >= ((this.currentPage) * (this.parPage))) {
                return ((this.currentPage) * (this.parPage) - 9) + "~" + ((this.currentPage) * (this.parPage))
            } else {
                return ((this.currentPage) * (this.parPage) - 9) + "~" + this.contacts.length
            }
            
        }
    },
    filters: {
        limitText(text) {
            return text.length > 25 ? text.slice(0, 25) + "..." : text;
        }
    },
    created() {
        this.getContacts();
    }
}
</script>

<style scoped>
.container{
    width: 100%;
}
h2 {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 50px;
}
input {
    border: 1px solid #888;
    border-radius: 5px;
}
.btn {
    background-color: #000;
    color: #fff;
    box-shadow: 2px 2px #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}
.search-box {
    width: 80%;
    margin: 30px auto;
    border: 2px solid #000;
    padding: 30px 50px;
    font-size: 1.1rem;
}
.item-label {
    font-weight: bold;
    margin-right: 30px;
}
.name {
    margin-bottom: 30px;
    display: inline-block;
    margin-right: 30px;
}
.name label {
    margin-right: 100px;
}
.name input {
    height: 30px;
    width: 200px;
}
.gender {
    display: inline-block;
    vertical-align: middle;
}
.gender input {
    transform: scale(2);
    margin-right: 20px;
    margin-left: 20px;
}
.registrationーdate {
    margin-bottom: 30px;
}

.registrationーdate label{
    margin-right: 100px;
}

.registrationーdate input {
    width: 200px;
    height: 30px;
}
.registrationーdate span {
    margin: 0 15px;
}

.email {
    margin-bottom: 30px;
}

.email {
    margin-right: 10px;
}

.email input {
    width: 200px;
    height: 30px;
}

.search-btn {
    margin: 10px auto 10px;
    display: block;
    width: 150px;
    padding: 8px 20px;
    font-size: 1.2rem;
}

.reset {
    text-align: center;
    text-decoration: underline;
    cursor: pointer;
}

.contact-list {
    width: calc(80% + 100px);
    margin: 30px auto;
}
table {
    width: 100%;
    text-align: center;
}
table th {
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
}
table td {
    padding: 8px 0;
}
.paginate-box {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.paginate-box p {
    width: 300px;
    font-size: 1.1rem;
}

.delete-btn {
    width: 90%;
}

</style>


<style>

.pagination-item, .pagination-prev, .pagination-next{
  list-style: none;
}

.pagination-btn__link,
.pagination-item__link {
  border: solid 1px #888;
  text-align: center;
  padding: 5px 5px;
  display: block;
  font-size: 1.1rem;
}
.pagination-btn__link:hover,
.pagination-item__link:hover {
  background-color: #000;
  color: #fff;
}
.active .pagination-item__link {
  background-color: #000;
  color: #fff;
  pointer-events: none;
}
</style>