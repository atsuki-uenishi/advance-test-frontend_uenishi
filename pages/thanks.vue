<template>
    <div class="container">
        <div class="thanks">
            <p>ご意見いただきありがとうございました。</p>
            <button class="btn">トップページへ</button>
        </div>
    </div>
</template>

<style scoped>
.container {
    position: relative;
    height: 100vh;
    width: 100%;
}
.thanks {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
}
p {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 60px;
}
.btn {
    margin: 10px auto 15px;
    display: block;
    width: 200px;
    padding: 10px 15px;
    font-size: 1.2rem;
    background-color: #000;
    color: #fff;
    box-shadow: 2px 2px #ccc;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
}
</style>